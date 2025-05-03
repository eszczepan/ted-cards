import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/supabase/supabase.server";
import crypto from "crypto";
import {
  SOURCE_TYPE,
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
  async generateFlashcards(userId: string, params: CreateGenerationCommand): Promise<GenerateFlashcardsResult> {
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
    result: GenerateFlashcardsResult,
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
  private async logGenerationError(userId: string, params: CreateGenerationCommand, error: unknown): Promise<void> {
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
  private createMockProposals(params: CreateGenerationCommand): FlashcardProposalDTO[] {
    const { source_type, front_language, back_language } = params;

    const source =
      source_type === SOURCE_TYPE.YOUTUBE ? FLASHCARD_SOURCE.AI_YOUTUBE_FULL : FLASHCARD_SOURCE.AI_TEXT_FULL;

    // Create more realistic mock data based on source type
    if (source_type === SOURCE_TYPE.YOUTUBE) {
      return [
        {
          id: uuidv4(),
          front_content: "machine learning",
          back_content:
            "A subset of artificial intelligence that enables a system to learn from data without being explicitly programmed.",
          front_language,
          back_language,
          cefr_level: "B2",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "neural network",
          back_content:
            "A computing system inspired by biological neural networks that can learn to perform tasks by considering examples.",
          front_language,
          back_language,
          cefr_level: "C1",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "deep learning",
          back_content:
            "A subset of machine learning where artificial neural networks learn from large amounts of data.",
          front_language,
          back_language,
          cefr_level: "B2",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "supervised learning",
          back_content:
            "A type of machine learning where the model is trained on labeled data to make predictions or decisions.",
          front_language,
          back_language,
          cefr_level: "B1",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "reinforcement learning",
          back_content:
            "A type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize a reward.",
          front_language,
          back_language,
          cefr_level: "C1",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "artificial intelligence",
          back_content:
            "The simulation of human intelligence in machines that are programmed to think and learn like humans.",
          front_language,
          back_language,
          cefr_level: "A2",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "bias in machine learning",
          back_content:
            "When a machine learning model produces results that are systematically prejudiced due to erroneous assumptions in the training process.",
          front_language,
          back_language,
          cefr_level: "C2",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
      ];
    } else {
      // Text source
      return [
        {
          id: uuidv4(),
          front_content: "global warming",
          back_content:
            "The long-term heating of Earth's climate system observed since the pre-industrial period due to human activities.",
          front_language,
          back_language,
          cefr_level: "B1",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "carbon footprint",
          back_content:
            "The total amount of greenhouse gases produced to directly and indirectly support human activities, usually expressed in equivalent tons of carbon dioxide (CO2).",
          front_language,
          back_language,
          cefr_level: "B2",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "renewable energy",
          back_content:
            "Energy from sources that are naturally replenishing but flow-limited, such as sunlight, wind, rain, tides, waves, and geothermal heat.",
          front_language,
          back_language,
          cefr_level: "A2",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "greenhouse effect",
          back_content:
            "The trapping of the sun's warmth in a planet's lower atmosphere, due to the greater transparency of the atmosphere to visible radiation from the sun than to infrared radiation emitted from the planet's surface.",
          front_language,
          back_language,
          cefr_level: "B2",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "climate change",
          back_content:
            "A long-term change in the average weather patterns that have come to define Earth's local, regional and global climates.",
          front_language,
          back_language,
          cefr_level: "A1",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
        {
          id: uuidv4(),
          front_content: "sustainable development",
          back_content:
            "Development that meets the needs of the present without compromising the ability of future generations to meet their own needs.",
          front_language,
          back_language,
          cefr_level: "C1",
          source,
          status: FLASHCARD_PROPOSAL_STATUS.PENDING,
        },
      ];
    }
  }
}
