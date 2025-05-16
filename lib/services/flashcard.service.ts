import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/supabase/supabase.server";
import { FlashcardDTO, FLASHCARD_STATUS, FlashcardStatus, CefrLevel, FlashcardSource } from "@/types";
import type { CreateFlashcardRequest, UpdateFlashcardRequest } from "@/app/api/flashcards/schema";

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
        cefr_level: flashcard.cefr_level,
        source: flashcard.source,
        source_youtube_url: flashcard.source_youtube_url || undefined,
        generation_id: generationId,
        status: FLASHCARD_STATUS.ACTIVE,
        created_at: now,
        updated_at: now,
      }));
      const { data, error } = await supabase.from("flashcards").insert(flashcardRecords).select();

      console.info({
        userId,
        generationId,
        source: flashcardRecords[0].source,
        source_youtube_url: flashcardRecords[0].source_youtube_url,
        totalCreated: data?.length,
      });

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
  private async logFlashcardCreationError(userId: string, error: unknown): Promise<void> {
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

  /**
   * Gets a single flashcard by ID and validates user ownership
   * @param id Flashcard ID
   * @param userId User ID who should own the flashcard
   * @returns The flashcard if found and owned by the user, null otherwise
   */
  async getFlashcardById(id: string, userId: string): Promise<FlashcardDTO | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from("flashcards").select("*").eq("id", id).eq("user_id", userId).single();

      if (error) {
        console.error("Error fetching flashcard:", error);
        return null;
      }

      if (!data) {
        return null;
      }

      return this.mapToFlashcardDTOs([data as DatabaseFlashcard])[0];
    } catch (error) {
      console.error("Error in getFlashcardById:", error);
      return null;
    }
  }

  /**
   * Updates a flashcard
   * @param id Flashcard ID to update
   * @param userId User ID who should own the flashcard
   * @param data Updated flashcard data
   * @returns The updated flashcard
   */
  async updateFlashcard(id: string, userId: string, data: UpdateFlashcardRequest): Promise<FlashcardDTO | null> {
    try {
      const supabase = await createClient();
      const now = new Date().toISOString();

      const updateData = {
        ...data,
        updated_at: now,
      };

      const { data: updatedData, error } = await supabase
        .from("flashcards")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", userId)
        .select("*")
        .single();

      if (error) {
        console.error("Error updating flashcard:", error);
        throw new Error(`Failed to update flashcard: ${error.message}`);
      }

      return this.mapToFlashcardDTOs([updatedData as DatabaseFlashcard])[0];
    } catch (error) {
      console.error("Error in updateFlashcard:", error);
      throw error;
    }
  }

  /**
   * Deletes a flashcard
   * @param id Flashcard ID to delete
   * @param userId User ID who should own the flashcard
   */
  async deleteFlashcard(id: string, userId: string): Promise<void> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("flashcards").delete().eq("id", id).eq("user_id", userId);

      if (error) {
        console.error("Error deleting flashcard:", error);
        throw new Error(`Failed to delete flashcard: ${error.message}`);
      }
    } catch (error) {
      console.error("Error in deleteFlashcard:", error);
      throw error;
    }
  }

  /**
   * Gets flashcards from the database with pagination, filtering and sorting
   * @param userId User ID for the flashcards
   * @param options Options for filtering, sorting and pagination
   * @returns Flashcards and total count
   */
  async getFlashcards(
    userId: string,
    options: {
      page: number;
      limit: number;
      search?: string;
      cefr_level?: CefrLevel | null;
      status?: FlashcardStatus;
      sort_by?: string;
      sort_order?: "asc" | "desc";
    }
  ): Promise<{ flashcards: FlashcardDTO[]; total: number }> {
    try {
      const supabase = await createClient();
      const {
        page = 1,
        limit = 12,
        search = "",
        cefr_level = null,
        status = FLASHCARD_STATUS.ACTIVE,
        sort_by = "created_at",
        sort_order = "desc",
      } = options;

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Start building the query
      let query = supabase
        .from("flashcards")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .eq("status", status);

      // Add CEFR level filter if provided
      if (cefr_level) {
        query = query.eq("cefr_level", cefr_level);
      }

      // Add text search if provided
      if (search) {
        query = query.or(`front_content.ilike.%${search}%,back_content.ilike.%${search}%`);
      }

      // Add sorting
      if (sort_by && ["created_at", "cefr_level", "front_content"].includes(sort_by)) {
        query = query.order(sort_by, { ascending: sort_order === "asc" });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      // Add pagination
      query = query.range(offset, offset + limit - 1);

      // Execute the query
      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching flashcards:", error);
        throw new Error(`Failed to fetch flashcards: ${error.message}`);
      }

      const total = count || 0;
      return {
        flashcards: this.mapToFlashcardDTOs(data as DatabaseFlashcard[]),
        total,
      };
    } catch (error) {
      console.error("Error in getFlashcards:", error);
      throw error;
    }
  }
}
