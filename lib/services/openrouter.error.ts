class OpenRouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export class AuthenticationError extends OpenRouterError {
  constructor(message: string = "Authentication failed. Please check your API key.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends OpenRouterError {
  constructor(message: string = "Rate limit exceeded. Please try again later.") {
    super(message);
    this.name = "RateLimitError";
  }
}

export class ValidationError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NetworkError extends OpenRouterError {
  constructor(message: string = "Network error occurred. Please check your connection.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class ParsingError extends OpenRouterError {
  constructor(message: string = "Failed to parse API response.") {
    super(message);
    this.name = "ParsingError";
  }
}

export class ContextLimitError extends OpenRouterError {
  constructor(tokenCount: number) {
    super(`Text is too long. Current count: ${tokenCount} tokens exceeds model limit.`);
    this.name = "ContextLimitError";
  }
}
