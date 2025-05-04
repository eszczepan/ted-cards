import { z } from "zod";
import {
  ModelParameters,
  ResponseFormat,
  OpenRouterServiceConfig,
  OpenRouterResponse,
  SupportedModel,
  RequestMetadata,
} from "./openrouter.types";
import {
  AuthenticationError,
  ValidationError,
  NetworkError,
  ParsingError,
  RateLimitError,
  ContextLimitError,
} from "./openrouter.error";
import {
  FlashcardProposalDTO,
  CefrLevel,
  FLASHCARD_PROPOSAL_STATUS,
  CreateGenerationCommand,
  SOURCE_TYPE,
} from "@/types";
import { v4 as uuidv4 } from "uuid";
import { estimateTokenCount } from "../utils/token-counter";
import { sanitizeText } from "../utils/sanitize-text";
import { sleep } from "../utils";
import { openRouterConfigSchema, DEFAULT_FLASHCARD_SCHEMA, knownErrors, MODEL_CONFIGS } from "./openrouter.helpers";
import { generateFlashcardsPrompt } from "../prompts/prompts";

export class OpenRouterService {
  private apiKey: string;
  private defaultModelTier: SupportedModel;
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;
  private logger: Console;

  constructor(config: OpenRouterServiceConfig) {
    this.validateConfig(config);

    this.apiKey = config.apiKey;
    this.defaultModelTier = config.defaultModel || "balanced";
    this.baseUrl = config.baseUrl || "https://openrouter.ai/api/v1";
    this.timeout = config.timeout || 60000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.logger = console;
  }

  async generateFlashcards(userId: string, options: CreateGenerationCommand): Promise<FlashcardProposalDTO[]> {
    this.validateGenerationInput(options);

    const estimatedTokens = estimateTokenCount(options.source_text);
    const textLength = options.source_text.length;
    const modelTier = this.selectModelTier({
      textLength,
      complexity: options.cefr_level && ["C1", "C2"].includes(options.cefr_level) ? "high" : "medium",
      priority: textLength > 5000 ? "quality" : "cost",
    });

    const modelConfig = this.getModelConfig(modelTier);

    if (estimatedTokens > modelConfig.contextLimit) {
      throw new ContextLimitError(estimatedTokens);
    }

    const parameters = { ...modelConfig.defaultParams };
    const prompt = generateFlashcardsPrompt(options);
    const metadata: RequestMetadata = {
      userId,
      requestId: uuidv4(),
      startTime: Date.now(),
    };

    try {
      const data = await this.makeRequestWithRetry(prompt, parameters, DEFAULT_FLASHCARD_SCHEMA, metadata, modelTier);
      const flashcards = this.parseFlashcardsResponse(data.choices[0].message.content);

      this.logSuccess(metadata, data, flashcards.length);

      return this.mapToFlashcardProposals(flashcards, options);
    } catch (error) {
      if (error instanceof Error && knownErrors.some((errorType) => error instanceof errorType)) {
        throw error;
      }

      throw new ParsingError(
        `Failed to generate flashcards: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private selectModelTier(options: {
    textLength: number;
    complexity?: "low" | "medium" | "high";
    priority?: "speed" | "quality" | "cost";
  }): SupportedModel {
    const { textLength, complexity = "medium", priority = "quality" } = options;

    if (textLength < 500) {
      return "economy";
    }

    if (textLength > 10000) {
      return "premium";
    }

    if (priority === "speed") {
      return "economy";
    } else if (priority === "cost") {
      return complexity === "high" ? "balanced" : "economy";
    } else {
      return complexity === "high" ? "premium" : "balanced";
    }
  }

  private getModelConfig(tier?: SupportedModel): (typeof MODEL_CONFIGS)[SupportedModel] {
    const modelTier = tier || this.defaultModelTier;
    return MODEL_CONFIGS[modelTier];
  }

  private async makeRequestWithRetry(
    prompt: string,
    parameters: ModelParameters,
    responseFormat: ResponseFormat,
    metadata: RequestMetadata,
    modelTier?: SupportedModel
  ): Promise<OpenRouterResponse> {
    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt <= this.maxRetries) {
      try {
        return await this.makeRequest(prompt, parameters, responseFormat, metadata, modelTier);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (
          error instanceof AuthenticationError ||
          error instanceof ValidationError ||
          error instanceof ContextLimitError
        ) {
          this.logError(lastError, metadata);
          throw error;
        }

        if (error instanceof RateLimitError && modelTier === "premium") {
          this.logger.warn(`Rate limited on premium model, trying balanced model instead`);
          try {
            return await this.makeRequest(prompt, parameters, responseFormat, metadata, "balanced");
          } catch {}
        }

        if (attempt < this.maxRetries) {
          const delayWithJitter = this.retryDelay * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4);
          await sleep(delayWithJitter);
          attempt += 1;
        } else {
          this.logError(lastError, metadata);
          throw lastError;
        }
      }
    }

    throw lastError || new Error("Unknown error during request");
  }

  private async makeRequest(
    prompt: string,
    parameters: ModelParameters,
    responseFormat: ResponseFormat,
    metadata: RequestMetadata,
    modelTier?: SupportedModel
  ): Promise<OpenRouterResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const modelConfig = this.getModelConfig(modelTier);
    const modelId = modelConfig.modelId;

    const sanitizedPrompt = sanitizeText(prompt);

    try {
      const payload = {
        model: modelId,
        messages: [{ role: "user", content: sanitizedPrompt }],
        stream: false,
        ...modelConfig.defaultParams,
        ...parameters,
        response_format: responseFormat,
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://tedcards.com",
          "X-Title": "TedCards",
          "X-Request-ID": metadata.requestId,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new AuthenticationError(`Authentication failed: ${errorText}`);
        } else if (response.status === 429) {
          throw new RateLimitError(`Rate limit exceeded: ${errorText}`);
        } else {
          throw new NetworkError(`API request failed with status ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();

      if (
        !data ||
        !Array.isArray(data.choices) ||
        data.choices.length === 0 ||
        !data.choices[0].message ||
        typeof data.choices[0].message.content !== "string" ||
        !data.usage ||
        typeof data.usage.prompt_tokens !== "number" ||
        typeof data.usage.completion_tokens !== "number"
      ) {
        throw new ParsingError("Invalid API response format");
      }

      return data as OpenRouterResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private parseFlashcardsResponse(responseContent: string): Array<{
    front_content: string;
    back_content: string;
    cefr_level: string;
  }> {
    let content: Record<string, unknown>;

    try {
      content = JSON.parse(responseContent);
    } catch {
      throw new ParsingError("Failed to parse JSON response");
    }

    if (!content || !content.flashcards || !Array.isArray(content.flashcards)) {
      throw new ParsingError("Invalid flashcard generation response format");
    }

    return content.flashcards as Array<{
      front_content: string;
      back_content: string;
      cefr_level: string;
    }>;
  }

  private mapToFlashcardProposals(
    flashcards: Array<{ front_content: string; back_content: string; cefr_level: string }>,
    options: CreateGenerationCommand
  ): FlashcardProposalDTO[] {
    const source = options.source_type === SOURCE_TYPE.YOUTUBE ? "ai_youtube_full" : "ai_text_full";

    return flashcards.map((card) => ({
      id: uuidv4(),
      front_content: card.front_content,
      back_content: card.back_content,
      front_language: options.front_language,
      back_language: options.back_language,
      cefr_level: card.cefr_level as CefrLevel,
      source,
      status: FLASHCARD_PROPOSAL_STATUS.PENDING,
    }));
  }

  private validateGenerationInput(options: CreateGenerationCommand): void {
    if (!options.source_text) {
      throw new ValidationError("Source text is required");
    }

    if (!options.front_language || !options.back_language) {
      throw new ValidationError("Front and back languages are required");
    }
  }

  private validateConfig(config: OpenRouterServiceConfig): void {
    try {
      openRouterConfigSchema.parse(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
        throw new ValidationError(`Invalid configuration: ${errorMessages}`);
      }
      throw new ValidationError("Invalid configuration");
    }

    if (!config.apiKey) {
      throw new AuthenticationError("API key is required");
    }
  }

  private logError(error: Error, metadata: RequestMetadata): void {
    const duration = Date.now() - metadata.startTime;

    this.logger.error({
      type: error.name,
      message: error.message,
      timestamp: new Date().toISOString(),
      userId: metadata.userId || "unknown",
      requestId: metadata.requestId,
      model: this.defaultModelTier,
      duration,
    });
  }

  private logSuccess(metadata: RequestMetadata, data: OpenRouterResponse, flashcardCount: number): void {
    const duration = Date.now() - metadata.startTime;
    this.logger.info({
      type: "FlashcardsGenerated",
      timestamp: new Date().toISOString(),
      userId: metadata.userId,
      requestId: metadata.requestId,
      model: data.model,
      duration,
      tokenCount: {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens,
      },
      flashcardCount,
    });
  }
}
