export function estimateTokenCount(text: string): number {
  if (!text) return 0;

  const nonLatinCharCount = (text.match(/[^\u0000-\u007F]/g) || []).length;
  const latinCharCount = text.length - nonLatinCharCount;
  const latinTokens = Math.ceil(latinCharCount / 4);
  const nonLatinTokens = Math.ceil(nonLatinCharCount / 1.5);
  const totalTokens = latinTokens + nonLatinTokens;

  return Math.ceil(totalTokens * 1.1);
}
