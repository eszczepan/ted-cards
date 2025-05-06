export const CEFR_LEVEL = {
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  C1: "C1",
  C2: "C2",
} as const;

export type CefrLevel = (typeof CEFR_LEVEL)[keyof typeof CEFR_LEVEL];

export const FLASHCARD_SOURCE = {
  AI_YOUTUBE_FULL: "ai_youtube_full",
  AI_YOUTUBE_EDITED: "ai_youtube_edited",
  AI_TEXT_FULL: "ai_text_full",
  AI_TEXT_EDITED: "ai_text_edited",
  MANUAL: "manual",
} as const;

export type FlashcardSource = (typeof FLASHCARD_SOURCE)[keyof typeof FLASHCARD_SOURCE];

export const FLASHCARD_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type FlashcardStatus = (typeof FLASHCARD_STATUS)[keyof typeof FLASHCARD_STATUS];

export const SOURCE_TYPE = {
  YOUTUBE: "youtube",
  TEXT: "text",
} as const;

export type SourceType = (typeof SOURCE_TYPE)[keyof typeof SOURCE_TYPE];

export const FLASHCARD_PROPOSAL_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  EDITED: "edited",
  REJECTED: "rejected",
} as const;

export type FlashcardProposalStatus = (typeof FLASHCARD_PROPOSAL_STATUS)[keyof typeof FLASHCARD_PROPOSAL_STATUS];

export interface User {
  id: string; // UUID
  email: string;
  created_at: Date;
  confirmed_at: Date;
}

export interface Flashcard {
  id: string; // UUID
  user_id: string; // UUID
  front_content: string;
  back_content: string;
  front_language: string;
  back_language: string;
  cefr_level: CefrLevel;
  source: FlashcardSource;
  source_youtube_url: string | null;
  status: FlashcardStatus;
  generation_id: string | null; // UUID
  created_at: Date;
  updated_at: Date;
}

export interface Generation {
  id: string; // UUID
  user_id: string; // UUID
  model: string;
  generation_duration: number;
  generated_count: number;
  accepted_unedited_count: number | null;
  accepted_edited_count: number | null;
  source_type: SourceType;
  source_text_hash: string;
  source_text_length: number;
  source_youtube_url: string | null;
  source_text: string;
  created_at: Date;
}

export interface GenerationErrorLog {
  id: string; // UUID
  user_id: string; // UUID
  model: string | null;
  source_type: SourceType | null;
  source_youtube_url: string | null;
  source_text_hash: string;
  source_text_length: number;
  error_code: string;
  error_message: string;
  created_at: Date;
}

/**
 * Wspólny DTO dla paginacji używany w różnych odpowiedziach API
 */
export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * DTO i Command Modele dla endpointów Flashcards
 */

// DTO używane do zwracania pojedynczej fiszki (wybieramy tylko potrzebne pola)
export type FlashcardDTO = Pick<
  Flashcard,
  | "id"
  | "front_content"
  | "back_content"
  | "front_language"
  | "back_language"
  | "cefr_level"
  | "source"
  | "source_youtube_url"
  | "generation_id"
  | "status"
  | "created_at"
  | "updated_at"
>;

// Odpowiedź z API zawierająca listę fiszek z paginacją
export interface FlashcardListResponseDTO {
  data: FlashcardDTO[];
  pagination: PaginationDTO;
}

// DTO używane do tworzenia pojedynczej fiszki
export interface CreateFlashcardDTO {
  front_content: string; // max 200 znaków
  back_content: string; // max 500 znaków
  front_language: string;
  back_language: string;
  cefr_level: CefrLevel;
  source?: FlashcardSource; // domyślnie manual
  source_youtube_url?: string; // wymagane jeśli source zawiera youtube
}

// Komenda do tworzenia wielu fiszek
export interface CreateFlashcardsCommand {
  flashcards: CreateFlashcardDTO[];
  generation_id?: string; // opcjonalne powiązanie z konkretną generacją
}

// Odpowiedź po utworzeniu fiszek
export interface CreateFlashcardsResponseDTO {
  success: boolean;
  created_count: number;
  flashcards: FlashcardDTO[];
}

// DTO używane do aktualizacji fiszki, wszystkie pola są opcjonalne
export type UpdateFlashcardDTO = Partial<{
  front_content: string; // max 200 znaków
  back_content: string; // max 500 znaków
  front_language: string;
  back_language: string;
  cefr_level: CefrLevel;
  status: FlashcardStatus;
}>;

/**
 * DTO i Command Modele dla endpointów Generations
 */

// DTO używane do zwracania sesji generacji (wybieramy tylko potrzebne pola)
export type GenerationDTO = Pick<
  Generation,
  | "id"
  | "model"
  | "generation_duration"
  | "generated_count"
  | "accepted_unedited_count"
  | "accepted_edited_count"
  | "source_type"
  | "source_text_length"
  | "source_youtube_url"
  | "created_at"
>;

// Odpowiedź z API zawierająca listę generacji z paginacją
export interface GenerationListResponseDTO {
  data: GenerationDTO[];
  pagination: PaginationDTO;
}

// DTO używane do reprezentacji propozycji fiszki wygenerowanej przez AI
export interface FlashcardProposalDTO {
  id: string; // tymczasowe UUID
  front_content: string;
  back_content: string;
  front_language: string;
  back_language: string;
  cefr_level: CefrLevel;
  source: FlashcardSource;
  status?: FlashcardProposalStatus; // tymczasowy status propozycji
  source_youtube_url?: string;
}

// Szczegóły generacji z dołączonymi propozycjami fiszek
export interface GenerationDetailDTO extends GenerationDTO {
  flashcard_proposals: FlashcardProposalDTO[];
}

// Komenda do rozpoczęcia nowego procesu generacji
export interface CreateGenerationCommand {
  source_type: SourceType;
  source_text: string;
  source_youtube_url?: string;
  front_language: string;
  back_language: string;
  cefr_level?: CefrLevel;
  count?: number;
}

// Odpowiedź po rozpoczęciu procesu generacji
export interface CreateGenerationResponseDTO {
  id: string;
  status: string; // np. pending, completed, error
  flashcard_proposals: FlashcardProposalDTO[];
  created_at: Date;
}

/**
 * DTO dla endpointów Generation Error Logs
 */

// DTO używane do zwracania logu błędu (wybieramy tylko potrzebne pola)
export type GenerationErrorLogDTO = Pick<
  GenerationErrorLog,
  | "id"
  | "model"
  | "source_type"
  | "source_youtube_url"
  | "source_text_length"
  | "error_code"
  | "error_message"
  | "created_at"
>;

// Odpowiedź z API zawierająca listę logów błędów z paginacją
export interface GenerationErrorLogListResponseDTO {
  data: GenerationErrorLogDTO[];
  pagination: PaginationDTO;
}
