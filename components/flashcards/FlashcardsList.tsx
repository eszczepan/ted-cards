"use client";

import { FlashcardDTO, PaginationDTO } from "@/types";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import Pagination from "@/components/flashcards/Pagination";

interface FlashcardsListProps {
  flashcards: FlashcardDTO[];
  pagination: PaginationDTO;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onEditFlashcard: (flashcard: FlashcardDTO) => void;
  onDeleteFlashcard: (flashcard: FlashcardDTO) => void;
}

export default function FlashcardsList({
  flashcards,
  pagination,
  isLoading,
  onPageChange,
  onEditFlashcard,
  onDeleteFlashcard,
}: FlashcardsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-xl font-medium mb-2">No flashcards found</h3>
        <p className="text-gray-500 max-w-md">
          No flashcards found. Try changing your search filters or create new flashcards.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((flashcard) => (
          <FlashcardItem
            key={flashcard.id}
            flashcard={flashcard}
            onEdit={() => onEditFlashcard(flashcard)}
            onDelete={() => onDeleteFlashcard(flashcard)}
          />
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="mt-8">
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
