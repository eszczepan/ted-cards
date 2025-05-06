import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/supabase/supabase.server";
import { OpenRouterService } from "./openrouter.service";
import { ValidationError, ParsingError } from "./openrouter.error";
import { generateMD5Hash } from "../utils";
import { generateFlashcardsPrompt } from "../prompts/prompts";
import { DEFAULT_FLASHCARD_SCHEMA } from "../utils/openrouter";
import { FlashcardGenerationResponse, RequestMetadata } from "@/types/openrouter";
import {
  CefrLevel,
  CreateGenerationCommand,
  FLASHCARD_PROPOSAL_STATUS,
  FlashcardProposalDTO,
  FlashcardProposalStatus,
  FlashcardSource,
  SOURCE_TYPE,
} from "@/types";

export class GenerationService {
  private openRouterService: OpenRouterService;

  constructor() {
    this.openRouterService = new OpenRouterService({
      apiKey: process.env.OPENROUTER_API_KEY || "",
      defaultModel: "premium",
    });
  }

  async generateFlashcards(
    userId: string,
    payload: CreateGenerationCommand
  ): Promise<{
    generationId: string;
    generationDuration: number;
    proposals: FlashcardProposalDTO[];
    createdAt: string;
  }> {
    const { source_text, source_type, front_language, back_language, source_youtube_url } = payload;
    const prompt = generateFlashcardsPrompt(payload);
    const generationId = uuidv4();
    const startTime = Date.now();
    const metadata: RequestMetadata = {
      userId,
      requestId: generationId,
      startTime,
    };

    if (!source_text) {
      throw new ValidationError("Source text is required");
    }

    if (!front_language || !back_language) {
      throw new ValidationError("Front and back languages are required");
    }

    try {
      const { model, content, usage } = await this.openRouterService.makeRequestWithRetry<FlashcardGenerationResponse>(
        prompt,
        DEFAULT_FLASHCARD_SCHEMA,
        metadata
      );

      if (!content || !Array.isArray(content.flashcards)) {
        throw new ParsingError("Invalid flashcard generation response format");
      }

      const source = source_type === SOURCE_TYPE.YOUTUBE ? "ai_youtube_full" : "ai_text_full";

      const proposals = content.flashcards.map((card) => ({
        id: uuidv4(),
        front_content: card.front_content,
        back_content: card.back_content,
        front_language: front_language,
        back_language: back_language,
        cefr_level: card.cefr_level as CefrLevel,
        source: source as FlashcardSource,
        status: FLASHCARD_PROPOSAL_STATUS.PENDING as FlashcardProposalStatus,
        source_youtube_url: source_youtube_url,
      }));

      const generationDuration = Date.now() - startTime;
      const createdAt = new Date().toISOString();
      const generationRecord = await this.createGenerationRecord(
        userId,
        payload,
        generationId,
        generationDuration,
        proposals,
        model,
        createdAt
      );
      console.info({ ...generationRecord, totalTokens: usage.total_tokens });

      return { generationId, generationDuration, proposals, createdAt };
    } catch (error) {
      await this.logGenerationError(userId, payload, error);
      throw error;
    }
  }

  async createGenerationRecord(
    userId: string,
    payload: CreateGenerationCommand,
    generationId: string,
    generationDuration: number,
    proposals: FlashcardProposalDTO[],
    modelAI: string,
    createdAt: string
  ): Promise<{
    generationId: string;
    generationDuration: number;
    modelAI: string;
    generatedCount: number;
    createdAt: string;
  }> {
    const supabase = await createClient();
    const sourceTextHash = generateMD5Hash(payload.source_text);

    const { error } = await supabase.from("generations").insert({
      id: generationId,
      user_id: userId,
      model: modelAI,
      generation_duration: generationDuration,
      generated_count: proposals.length,
      source_type: payload.source_type,
      source_text_hash: sourceTextHash,
      source_text_length: payload.source_text.length,
      source_youtube_url: payload.source_youtube_url,
      source_text: payload.source_text,
      created_at: createdAt,
    });

    if (error) {
      console.error("Error creating generation record:", error);
      throw new Error("Failed to create generation record");
    }

    return { generationId, generationDuration, modelAI, generatedCount: proposals.length, createdAt };
  }

  private async logGenerationError(userId: string, payload: CreateGenerationCommand, error: unknown): Promise<void> {
    try {
      const supabase = await createClient();
      const sourceTextHash = generateMD5Hash(payload.source_text);

      await supabase.from("generation_error_logs").insert({
        id: uuidv4(),
        user_id: userId,
        model: "Add model here", // Use actual model info when available
        source_type: payload.source_type,
        source_youtube_url: payload.source_youtube_url,
        source_text_hash: sourceTextHash,
        source_text_length: payload.source_text.length,
        error_code: error instanceof Error ? error.name : "UNKNOWN_ERROR",
        error_message: error instanceof Error ? error.message : String(error),
        created_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Failed to log generation error:", logError);
    }
  }
}
