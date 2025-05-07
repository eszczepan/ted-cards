import { AppError } from "./base";

/**
 * Error thrown when parsing of API response fails
 */
export class ParsingError extends AppError {
  constructor(message: string = "Failed to parse API response.") {
    super(message);
  }
}

/**
 * Error thrown when the context length exceeds the model's limit
 */
export class ContextLimitError extends AppError {
  tokenCount: number;

  constructor(tokenCount: number) {
    super(`Text is too long. Current count: ${tokenCount} tokens exceeds model limit.`);
    this.tokenCount = tokenCount;
  }
}
