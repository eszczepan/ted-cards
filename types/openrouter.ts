export type OpenRouterServiceConfig = {
  apiKey: string;
  defaultModel?: SupportedModel;
};

export type SupportedModel = "economy" | "balanced" | "premium";

export type ModelParameters = {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
};

export interface RequestMetadata {
  userId?: string;
  requestId: string;
  startTime: number;
}

export type ResponseFormat = {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: object;
  };
};

export type OpenRouterResponse<T> = {
  model: string;
  content: T;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type FlashcardGenerationResponse = {
  flashcards: Array<{
    front_content: string;
    back_content: string;
    cefr_level: string;
  }>;
};
