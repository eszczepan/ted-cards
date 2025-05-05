import { z } from "zod";
import {
  ResponseFormat,
  OpenRouterServiceConfig,
  OpenRouterResponse,
  SupportedModel,
  RequestMetadata,
} from "@/types/openrouter";
import {
  AuthenticationError,
  ValidationError,
  NetworkError,
  ParsingError,
  RateLimitError,
  ContextLimitError,
} from "./openrouter.error";
import { sanitizeText } from "../utils/sanitize-text";
import { sleep } from "../utils";
import { openRouterConfigSchema, MODEL_CONFIGS } from "../utils/openrouter";

export class OpenRouterService {
  private apiKey: string;
  private defaultModelTier: SupportedModel;
  private timeout = 60000;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor(config: OpenRouterServiceConfig) {
    this.validateInitConfig(config);

    this.apiKey = config.apiKey;
    this.defaultModelTier = config.defaultModel || "balanced";
  }

  public selectModelTier(options: {
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

  public getModelConfig(tier?: SupportedModel): (typeof MODEL_CONFIGS)[SupportedModel] {
    const modelTier = tier || this.defaultModelTier;
    return MODEL_CONFIGS[modelTier];
  }

  public async makeRequestWithRetry<T>(
    prompt: string,
    responseFormat: ResponseFormat,
    metadata: RequestMetadata,
    modelTier?: SupportedModel
  ): Promise<OpenRouterResponse<T>> {
    let lastError: Error | null = null;
    let attempt = 0;
    while (attempt <= this.maxRetries) {
      try {
        return await this.makeRequest<T>(prompt, responseFormat, metadata, modelTier);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (
          error instanceof AuthenticationError ||
          error instanceof ValidationError ||
          error instanceof ContextLimitError
        ) {
          console.log(lastError, metadata);
          throw error;
        }

        if (error instanceof RateLimitError && modelTier === "premium") {
          console.warn(`Rate limited on premium model, trying balanced model instead`);
          try {
            return await this.makeRequest<T>(prompt, responseFormat, metadata, "balanced");
          } catch {}
        }

        if (attempt < this.maxRetries) {
          const delayWithJitter = this.retryDelay * Math.pow(2, attempt) * (0.8 + Math.random() * 0.4);
          await sleep(delayWithJitter);
          attempt += 1;
        } else {
          const duration = Date.now() - metadata.startTime;

          console.error({
            type: lastError.name,
            message: lastError.message,
            timestamp: new Date().toISOString(),
            userId: metadata.userId || "unknown",
            requestId: metadata.requestId,
            model: this.defaultModelTier,
            duration,
          });
          throw lastError;
        }
      }
    }

    throw lastError || new Error("Unknown error during request");
  }

  public async makeRequest<T>(
    prompt: string,
    responseFormat: ResponseFormat,
    metadata: RequestMetadata,
    modelTier?: SupportedModel
  ): Promise<OpenRouterResponse<T>> {
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
        response_format: responseFormat,
      };

      const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
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

      const content = JSON.parse(data.choices[0].message.content) as T;

      return { model: data.model, content, usage: data.usage };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private validateInitConfig(config: OpenRouterServiceConfig): void {
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
}
