import { z } from "zod";
import { SOURCE_TYPE, CEFR_LEVEL, FLASHCARD_SOURCE, FLASHCARD_PROPOSAL_STATUS } from "@/types";

const youtubeUrlSchema = z.string().url("Invalid YouTube URL");
const sourceTextSchema = z.string().max(15000, "Text cannot exceed 15000 characters");
const languageSchema = z.string().min(2, "Language code is required");

const youtubeGenerationSchema = z.object({
  source_type: z.literal(SOURCE_TYPE.YOUTUBE),
  source_youtube_url: youtubeUrlSchema,
  source_text: sourceTextSchema.optional(),
  front_language: languageSchema,
  back_language: languageSchema,
});

const textGenerationSchema = z.object({
  source_type: z.literal(SOURCE_TYPE.TEXT),
  source_text: sourceTextSchema.min(1, "Source text is required"),
  source_youtube_url: z.string().optional(),
  front_language: languageSchema,
  back_language: languageSchema,
});

export const createGenerationSchema = z.discriminatedUnion("source_type", [
  youtubeGenerationSchema,
  textGenerationSchema,
]);

export const flashcardProposalSchema = z.object({
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
  status: z
    .enum([
      FLASHCARD_PROPOSAL_STATUS.PENDING,
      FLASHCARD_PROPOSAL_STATUS.ACCEPTED,
      FLASHCARD_PROPOSAL_STATUS.EDITED,
      FLASHCARD_PROPOSAL_STATUS.REJECTED,
    ])
    .optional(),
});

export const createGenerationResponseSchema = z.object({
  id: z.string().uuid(),
  status: z.string(),
  flashcard_proposals: z.array(flashcardProposalSchema),
  created_at: z.date(),
});

// Type inference
export type CreateGenerationRequest = z.infer<typeof createGenerationSchema>;
export type FlashcardProposalResponse = z.infer<typeof flashcardProposalSchema>;
export type CreateGenerationResponse = z.infer<typeof createGenerationResponseSchema>;
