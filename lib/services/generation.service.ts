import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/supabase/supabase.server";
import { FlashcardProposalDTO, CreateGenerationCommand } from "@/types";
import { OpenRouterService } from "./openrouter.service";
import { ContextLimitError, AuthenticationError, RateLimitError } from "./openrouter.error";
import { generateMD5Hash } from "../utils";

interface GenerateFlashcardsResult {
  proposals: FlashcardProposalDTO[];
  generationDuration: number;
}

export class GenerationService {
  private openRouterService: OpenRouterService;

  constructor() {
    this.openRouterService = new OpenRouterService({
      apiKey: process.env.OPENROUTER_API_KEY || "",
      defaultModel: "balanced",
      maxRetries: 2,
    });
  }

  async generateFlashcards(userId: string, params: CreateGenerationCommand): Promise<GenerateFlashcardsResult> {
    const startTime = Date.now();

    try {
      const proposals = await this.openRouterService.generateFlashcards(userId, params);
      const endTime = Date.now();
      const generationDuration = endTime - startTime;

      return {
        proposals,
        generationDuration,
      };
    } catch (error) {
      if (error instanceof ContextLimitError) {
        throw new Error(`Text is too long: ${error.message}`);
      } else if (error instanceof AuthenticationError) {
        throw new Error("Authentication failed. Contact support.");
      } else if (error instanceof RateLimitError) {
        throw new Error("Service temporarily unavailable. Please try again later.");
      }

      await this.logGenerationError(userId, params, error);
      throw error;
    }
  }

  async createGenerationRecord(
    userId: string,
    params: CreateGenerationCommand,
    result: GenerateFlashcardsResult
  ): Promise<{ id: string; createdAt: string }> {
    const supabase = await createClient();

    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const sourceTextHash = generateMD5Hash(params.source_text);

    const { error } = await supabase.from("generations").insert({
      id,
      user_id: userId,
      model: "Add model here", // Use actual model info when available
      generation_duration: result.generationDuration,
      generated_count: result.proposals.length,
      accepted_unedited_count: 0,
      accepted_edited_count: 0,
      source_type: params.source_type,
      source_text_hash: sourceTextHash,
      source_text_length: params.source_text.length,
      source_youtube_url: params.source_youtube_url,
      source_text: params.source_text,
      created_at: createdAt,
    });

    if (error) {
      console.error("Error creating generation record:", error);
      throw new Error("Failed to create generation record");
    }

    return { id, createdAt };
  }

  private async logGenerationError(userId: string, params: CreateGenerationCommand, error: unknown): Promise<void> {
    try {
      const supabase = await createClient();
      const sourceTextHash = generateMD5Hash(params.source_text);

      await supabase.from("generation_error_logs").insert({
        id: uuidv4(),
        user_id: userId,
        model: "Add model here", // Use actual model info when available
        source_type: params.source_type,
        source_youtube_url: params.source_youtube_url,
        source_text_hash: sourceTextHash,
        source_text_length: params.source_text.length,
        error_code: error instanceof Error ? error.name : "UNKNOWN_ERROR",
        error_message: error instanceof Error ? error.message : String(error),
        created_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Failed to log generation error:", logError);
    }
  }
}
