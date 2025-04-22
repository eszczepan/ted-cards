import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/supabase/supabase.server";
import crypto from "crypto";
import {
  SOURCE_TYPE,
  CefrLevel,
  FLASHCARD_SOURCE,
  FLASHCARD_PROPOSAL_STATUS,
  FlashcardProposalDTO,
  CreateGenerationCommand,
} from "@/types";

interface GenerateFlashcardsResult {
  proposals: FlashcardProposalDTO[];
  generationDuration: number;
}

export class GenerationService {
  /**
   * Generates flashcard proposals based on the input text or YouTube URL
   * @param userId User ID for the generation
   * @param params Generation parameters
   * @returns Generated flashcard proposals and metadata
   */
  async generateFlashcards(
    userId: string,
    params: CreateGenerationCommand
  ): Promise<GenerateFlashcardsResult> {
    const startTime = Date.now();

    try {
      // This is a mock implementation for development
      // In production, this would call an AI service
      const mockProposals = this.createMockProposals(params);

      const endTime = Date.now();
      const generationDuration = endTime - startTime;

      return {
        proposals: mockProposals,
        generationDuration,
      };
    } catch (error) {
      // Log the error
      await this.logGenerationError(userId, params, error);
      throw error;
    }
  }

  /**
   * Creates a new generation record in the database
   * @param userId User ID for the generation
   * @param params Generation parameters
   * @param result Generation result
   * @returns Generation ID and creation timestamp
   */
  async createGenerationRecord(
    userId: string,
    params: CreateGenerationCommand,
    result: GenerateFlashcardsResult
  ): Promise<{ id: string; createdAt: string }> {
    const supabase = await createClient();

    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const sourceTextHash = this.generateMD5Hash(params.source_text);

    const { error } = await supabase.from("generations").insert({
      id,
      user_id: userId,
      model: "gpt-3.5-turbo", // This would be the actual model used in production
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

  /**
   * Logs an error that occurred during generation
   * @param userId User ID for the generation
   * @param params Generation parameters
   * @param error The error that occurred
   */
  private async logGenerationError(
    userId: string,
    params: CreateGenerationCommand,
    error: unknown
  ): Promise<void> {
    try {
      const supabase = await createClient();
      const sourceTextHash = this.generateMD5Hash(params.source_text);

      await supabase.from("generation_error_logs").insert({
        id: uuidv4(),
        user_id: userId,
        model: "gpt-3.5-turbo", // This would be the actual model used in production
        source_type: params.source_type,
        source_youtube_url: params.source_youtube_url,
        source_text_hash: sourceTextHash,
        source_text_length: params.source_text.length,
        error_code: error instanceof Error ? error.name : "UNKNOWN_ERROR",
        error_message: error instanceof Error ? error.message : String(error),
        created_at: new Date().toISOString(),
      });
    } catch (logError) {
      // Just log to console if we can't log to the database
      console.error("Failed to log generation error:", logError);
    }
  }

  /**
   * Generates MD5 hash from input text
   * @param text Text to hash
   * @returns MD5 hash as hex string
   */
  private generateMD5Hash(text: string): string {
    return crypto.createHash("md5").update(text).digest("hex");
  }

  /**
   * Creates mock flashcard proposals for development
   * @param params Generation parameters
   * @returns Array of mock flashcard proposals
   */
  private createMockProposals(
    params: CreateGenerationCommand
  ): FlashcardProposalDTO[] {
    const { source_type, front_language, back_language } = params;

    const source =
      source_type === SOURCE_TYPE.YOUTUBE
        ? FLASHCARD_SOURCE.AI_YOUTUBE_FULL
        : FLASHCARD_SOURCE.AI_TEXT_FULL;

    // Generate between 5-10 mock proposals
    const count = Math.floor(Math.random() * 6) + 5;
    const cefrLevels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

    return Array.from({ length: count }, (_, i) => ({
      id: uuidv4(),
      front_content: `Example front content ${i + 1}`,
      back_content: `Example back content ${
        i + 1
      } with more detailed explanation.`,
      front_language,
      back_language,
      cefr_level: cefrLevels[Math.floor(Math.random() * cefrLevels.length)],
      source,
      status: FLASHCARD_PROPOSAL_STATUS.PENDING,
    }));
  }
}
