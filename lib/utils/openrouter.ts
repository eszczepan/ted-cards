import { z } from "zod";
import { ModelParameters, ResponseFormat, SupportedModel } from "@/types/openrouter";
import {
  AuthenticationError,
  ValidationError,
  NetworkError,
  ParsingError,
  RateLimitError,
  ContextLimitError,
} from "../errors";

export const openRouterConfigSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  defaultModel: z.string().optional(),
});

export const knownErrors = [
  ParsingError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  ContextLimitError,
  ValidationError,
];

export const MODEL_CONFIGS: Record<
  SupportedModel,
  {
    modelId: string;
    contextLimit: number;
    defaultParams: ModelParameters;
    cost: number;
  }
> = {
  economy: {
    modelId: "google/gemini-flash-1.5-8b",
    contextLimit: 32000,
    defaultParams: {
      temperature: 0.3,
      max_tokens: 2000,
      top_p: 0.95,
    },
    cost: 0.0001,
  },
  balanced: {
    modelId: "google/gemini-flash-1.5-8b",
    contextLimit: 48000,
    defaultParams: {
      temperature: 0.5,
      max_tokens: 4000,
      top_p: 0.9,
    },
    cost: 0.0002,
  },
  premium: {
    modelId: "google/gemini-2.0-flash-001",
    contextLimit: 64000,
    defaultParams: {
      temperature: 0.7,
      max_tokens: 8000,
      top_p: 0.8,
    },
    cost: 0.0008,
  },
};

export const DEFAULT_FLASHCARD_SCHEMA: ResponseFormat = {
  type: "json_schema",
  json_schema: {
    name: "flashcards",
    strict: true,
    schema: {
      type: "object",
      properties: {
        flashcards: {
          type: "array",
          items: {
            type: "object",
            properties: {
              front_content: { type: "string" },
              back_content: { type: "string" },
              cefr_level: {
                type: "string",
                enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
              },
            },
            required: ["front_content", "back_content", "cefr_level"],
          },
        },
      },
      required: ["flashcards"],
    },
  },
};
