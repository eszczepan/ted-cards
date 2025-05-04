export type OpenRouterServiceConfig = {
  apiKey: string;
  defaultModel?: SupportedModel;
  timeout?: number;
  baseUrl?: string;
  maxRetries?: number;
  retryDelay?: number;
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

export type OpenRouterResponse = {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: MessageRole;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

type MessageRole = "system" | "user" | "assistant";
