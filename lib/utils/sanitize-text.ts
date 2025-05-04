const PATTERNS = {
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  PHONE: /(\+\d{1,3}[\s-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}/g,
  CREDIT_CARD: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
  SSN: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
  API_KEY: /\b(sk|pk|api|token|key|secret|password)_[a-zA-Z0-9]{10,}\b/gi,
  IP_ADDRESS: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
};

export function sanitizeText(
  text: string,
  replacement: string = "[REDACTED]",
  patterns: Record<string, RegExp> = PATTERNS
): string {
  if (!text) return text;

  let sanitized = text;

  Object.values(patterns).forEach((pattern) => {
    sanitized = sanitized.replace(pattern, replacement);
  });

  return sanitized;
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  sensitiveKeys: string[] = ["password", "secret", "token", "key", "auth"],
  replacement: string = "[REDACTED]"
): T {
  const result = { ...obj } as T;

  for (const [key, value] of Object.entries(obj)) {
    const isSensitiveKey = sensitiveKeys.some((sensitiveKey) => key.toLowerCase().includes(sensitiveKey.toLowerCase()));

    if (isSensitiveKey && typeof value === "string") {
      (result as Record<string, unknown>)[key] = replacement;
    } else if (typeof value === "object" && value !== null) {
      (result as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>,
        sensitiveKeys,
        replacement
      );
    } else if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeText(value, replacement);
    }
  }

  return result;
}

export function sanitizeError(error: Error): Error {
  const sanitizedError = new Error(sanitizeText(error.message));
  sanitizedError.name = error.name;
  sanitizedError.stack = sanitizeText(error.stack || "");
  return sanitizedError;
}

export function isContentSafe(text: string): boolean {
  if (!text) return true;

  const sensitivePatterns = [
    /\b(exec|eval|setTimeout|setInterval|Function|constructor)\s*\(/gi,
    /('|")\s*(OR|AND)\s*('|")\s*=\s*('|")/gi,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /\b(rm|chmod|chown|sudo|cp|mv)\s+-/gi,
  ];

  return !sensitivePatterns.some((pattern) => pattern.test(text));
}
