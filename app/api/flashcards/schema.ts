import { z } from "zod";
import { CEFR_LEVEL, FLASHCARD_SOURCE, FLASHCARD_STATUS } from "@/types";

export const createFlashcardSchema = z.object({
  front_content: z.string().max(200, "Front content cannot exceed 200 characters"),
  back_content: z.string().max(500, "Back content cannot exceed 500 characters"),
  front_language: z.string().min(2, "Front language is required"),
  back_language: z.string().min(2, "Back language is required"),
  cefr_level: z.enum([CEFR_LEVEL.A1, CEFR_LEVEL.A2, CEFR_LEVEL.B1, CEFR_LEVEL.B2, CEFR_LEVEL.C1, CEFR_LEVEL.C2]),
  source: z
    .enum([
      FLASHCARD_SOURCE.AI_YOUTUBE_FULL,
      FLASHCARD_SOURCE.AI_YOUTUBE_EDITED,
      FLASHCARD_SOURCE.AI_TEXT_FULL,
      FLASHCARD_SOURCE.AI_TEXT_EDITED,
      FLASHCARD_SOURCE.MANUAL,
    ])
    .default(FLASHCARD_SOURCE.MANUAL),
  source_youtube_url: z.string().url("Invalid YouTube URL").nullable().optional(),
});

// Schema for the entire request
export const createFlashcardsSchema = z
  .object({
    flashcards: z.array(createFlashcardSchema).min(1, "At least one flashcard is required"),
    generation_id: z.string().uuid("Invalid generation ID format").nullable().optional(),
  })
  .refine(
    (data) => {
      return !data.flashcards.some(
        (card) =>
          (card.source === FLASHCARD_SOURCE.AI_YOUTUBE_FULL || card.source === FLASHCARD_SOURCE.AI_YOUTUBE_EDITED) &&
          !card.source_youtube_url
      );
    },
    {
      message: "YouTube URL is required for flashcards with YouTube source",
      path: ["flashcards"],
    }
  );

export const flashcardResponseSchema = z.object({
  id: z.string().uuid(),
  front_content: z.string(),
  back_content: z.string(),
  front_language: z.string(),
  back_language: z.string(),
  cefr_level: z.enum([CEFR_LEVEL.A1, CEFR_LEVEL.A2, CEFR_LEVEL.B1, CEFR_LEVEL.B2, CEFR_LEVEL.C1, CEFR_LEVEL.C2]),
  source: z.enum([
    FLASHCARD_SOURCE.AI_YOUTUBE_FULL,
    FLASHCARD_SOURCE.AI_YOUTUBE_EDITED,
    FLASHCARD_SOURCE.AI_TEXT_FULL,
    FLASHCARD_SOURCE.AI_TEXT_EDITED,
    FLASHCARD_SOURCE.MANUAL,
  ]),
  source_youtube_url: z.string().url().nullable(),
  generation_id: z.string().uuid().nullable(),
  status: z.enum([FLASHCARD_STATUS.ACTIVE, FLASHCARD_STATUS.INACTIVE]),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const createFlashcardsResponseSchema = z.object({
  success: z.boolean(),
  created_count: z.number(),
  flashcards: z.array(flashcardResponseSchema),
});

export type CreateFlashcardRequest = z.infer<typeof createFlashcardSchema>;
export type CreateFlashcardsRequest = z.infer<typeof createFlashcardsSchema>;
export type FlashcardResponse = z.infer<typeof flashcardResponseSchema>;
export type CreateFlashcardsResponse = z.infer<typeof createFlashcardsResponseSchema>;
