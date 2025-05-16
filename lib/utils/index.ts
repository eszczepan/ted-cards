import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateMD5Hash(text: string): string {
  return crypto.createHash("md5").update(text).digest("hex");
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getLanguage(lang: string): string {
  if (lang === "en") {
    return "English";
  }
  if (lang === "pl") {
    return "Polish";
  }

  return lang.charAt(0).toUpperCase() + lang.slice(1);
}

export function debounce<F extends (...args: Array<unknown>) => unknown>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<F>) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
