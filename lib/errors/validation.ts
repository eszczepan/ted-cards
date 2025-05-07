import { AppError } from "./base";

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Error thrown when form validation fails
 * Contains field-specific error messages
 */
export class FormValidationError extends AppError {
  fields: Record<string, string>;

  constructor(fields: Record<string, string>) {
    const message = "Form validation failed";
    super(message);
    this.fields = fields;
  }
}
