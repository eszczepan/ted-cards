import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/supabase/supabase.server";
import { FlashcardProposalDTO, CreateGenerationCommand } from "@/types";
import { OpenRouterService } from "./openrouter.service";
import { ContextLimitError, AuthenticationError, RateLimitError } from "./openrouter.error";
import { generateMD5Hash } from "../utils";

export class GenerationService {
  private openRouterService: OpenRouterService;

  constructor() {
    this.openRouterService = new OpenRouterService({
      apiKey: process.env.OPENROUTER_API_KEY || "",
      defaultModel: "balanced",
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
    try {
      const { generationId, generationDuration, proposals, modelAI, createdAt } =
        await this.openRouterService.generateFlashcards(userId, payload);

      const generationRecord = await this.createGenerationRecord(
        userId,
        payload,
        generationId,
        generationDuration,
        proposals,
        modelAI,
        createdAt
      );

      console.log(generationRecord);

      return { generationId, generationDuration, proposals, createdAt };
    } catch (error) {
      if (error instanceof ContextLimitError) {
        throw new Error(`Text is too long: ${error.message}`);
      } else if (error instanceof AuthenticationError) {
        throw new Error("Authentication failed. Contact support.");
      } else if (error instanceof RateLimitError) {
        throw new Error("Service temporarily unavailable. Please try again later.");
      }

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
