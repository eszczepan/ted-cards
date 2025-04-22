import { z } from "zod";
import {
  SOURCE_TYPE,
  CEFR_LEVEL,
  FLASHCARD_SOURCE,
  FLASHCARD_PROPOSAL_STATUS,
} from "@/types";

// Request validation schema
export const createGenerationSchema = z
  .object({
    source_type: z.enum([SOURCE_TYPE.YOUTUBE, SOURCE_TYPE.TEXT]),
    source_text: z.string().max(15000, "Text cannot exceed 15000 characters"),
    source_youtube_url: z.string().url("Invalid YouTube URL").optional(),
    front_language: z.string().min(2, "Front language is required"),
    back_language: z.string().min(2, "Back language is required"),
  })
  .refine(
    (data) => {
      // YouTube URL is required when source type is 'youtube'
      return !(
        data.source_type === SOURCE_TYPE.YOUTUBE && !data.source_youtube_url
      );
    },
    {
      message: "YouTube URL is required when source type is 'youtube'",
      path: ["source_youtube_url"],
    }
  );

// Schemas for response validation
export const flashcardProposalSchema = z.object({
  id: z.string().uuid(),
  front_content: z.string(),
  back_content: z.string(),
  front_language: z.string(),
  back_language: z.string(),
  cefr_level: z.enum([
    CEFR_LEVEL.A1,
    CEFR_LEVEL.A2,
    CEFR_LEVEL.B1,
    CEFR_LEVEL.B2,
    CEFR_LEVEL.C1,
    CEFR_LEVEL.C2,
  ]),
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
export type CreateGenerationResponse = z.infer<
  typeof createGenerationResponseSchema
>;
