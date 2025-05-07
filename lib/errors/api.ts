import { AppError } from "./base";

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed. Please check your API key.") {
    super(message);
  }
}

/**
 * Error thrown when API rate limit is exceeded
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded. Please try again later.") {
    super(message);
  }
}

/**
 * Error thrown when network requests fail
 */
export class NetworkError extends AppError {
  constructor(message: string = "Network error occurred. Please check your connection.") {
    super(message);
  }
}

/**
 * Factory function to create API errors based on status code
 */
export function createApiError(status: number, message?: string): AppError {
  switch (status) {
    case 401:
      return new AuthenticationError(message);
    case 429:
      return new RateLimitError(message);
    default:
      return new AppError(message || `API error with status code: ${status}`);
  }
}
