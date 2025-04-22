import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/supabase/supabase.server";
import {
  FlashcardDTO,
  FLASHCARD_STATUS,
  FlashcardStatus,
  CefrLevel,
  FlashcardSource,
} from "@/types";
import type { CreateFlashcardRequest } from "@/app/api/flashcards/schema";

interface DatabaseFlashcard {
  id: string;
  user_id: string;
  front_content: string;
  back_content: string;
  front_language: string;
  back_language: string;
  cefr_level: CefrLevel;
  source: FlashcardSource;
  source_youtube_url: string | null;
  generation_id: string | null;
  status: FlashcardStatus;
  created_at: string;
  updated_at: string;
}

export class FlashcardService {
  /**
   * Creates multiple flashcards in the database
   * @param userId User ID for the flashcards
   * @param flashcards Array of flashcard data to create
   * @param generationId Optional generation ID to associate with flashcards
   * @returns Array of created flashcard objects
   */
  async createFlashcards(
    userId: string,
    flashcards: CreateFlashcardRequest[],
    generationId: string | null = null
  ): Promise<FlashcardDTO[]> {
    try {
      const supabase = await createClient();
      const now = new Date().toISOString();

      // Prepare flashcard records for batch insertion
      const flashcardRecords = flashcards.map((flashcard) => ({
        id: uuidv4(),
        user_id: userId,
        front_content: flashcard.front_content,
        back_content: flashcard.back_content,
        front_language: flashcard.front_language,
        back_language: flashcard.back_language,
        cefr_level: flashcard.cefr_level as CefrLevel,
        source: flashcard.source as FlashcardSource,
        source_youtube_url: flashcard.source_youtube_url || null,
        generation_id: generationId,
        status: FLASHCARD_STATUS.ACTIVE,
        created_at: now,
        updated_at: now,
      }));

      // Insert flashcards in a batch operation
      const { data, error } = await supabase
        .from("flashcards")
        .insert(flashcardRecords)
        .select();

      if (error) {
        console.error("Error creating flashcards:", error);
        await this.logFlashcardCreationError(userId, error);
        throw new Error("Failed to create flashcards");
      }

      // Transform database response to DTO format
      return this.mapToFlashcardDTOs(data as DatabaseFlashcard[]);
    } catch (error) {
      console.error("Flashcard service error:", error);
      await this.logFlashcardCreationError(userId, error);
      throw error;
    }
  }

  /**
   * Maps database flashcard records to FlashcardDTO objects
   * @param flashcards Flashcard records from database
   * @returns Array of FlashcardDTO objects
   */
  private mapToFlashcardDTOs(flashcards: DatabaseFlashcard[]): FlashcardDTO[] {
    return flashcards.map((flashcard) => ({
      id: flashcard.id,
      front_content: flashcard.front_content,
      back_content: flashcard.back_content,
      front_language: flashcard.front_language,
      back_language: flashcard.back_language,
      cefr_level: flashcard.cefr_level,
      source: flashcard.source,
      source_youtube_url: flashcard.source_youtube_url,
      generation_id: flashcard.generation_id,
      status: flashcard.status,
      created_at: new Date(flashcard.created_at),
      updated_at: new Date(flashcard.updated_at),
    }));
  }

  /**
   * Logs errors that occur during flashcard creation
   * @param userId User ID for the flashcards
   * @param error The error that occurred
   */
  private async logFlashcardCreationError(
    userId: string,
    error: unknown
  ): Promise<void> {
    try {
      const supabase = await createClient();

      await supabase.from("generation_error_logs").insert({
        id: uuidv4(),
        user_id: userId,
        source_type: null,
        source_youtube_url: null,
        source_text_hash: "00000000000000000000000000000000",
        source_text_length: 0,
        error_code: error instanceof Error ? error.name : "UNKNOWN_ERROR",
        error_message: error instanceof Error ? error.message : String(error),
        created_at: new Date().toISOString(),
      });
    } catch (logError) {
      // Just log to console if we can't log to the database
      console.error("Failed to log flashcard creation error:", logError);
    }
  }
}
