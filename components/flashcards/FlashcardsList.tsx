"use client";

import { FlashcardDTO, PaginationDTO } from "@/types";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import Pagination from "@/components/flashcards/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface FlashcardsListProps {
  flashcards: FlashcardDTO[];
  pagination: PaginationDTO;
  isLoading: boolean;
  isInitialLoading?: boolean;
  onPageChange: (page: number) => void;
  onEditFlashcard: (flashcard: FlashcardDTO) => void;
  onDeleteFlashcard: (flashcard: FlashcardDTO) => void;
}

function FlashcardSkeleton() {
  return (
    <div className="h-[300px] w-full">
      <div className="w-full h-full rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center justify-center flex-grow py-8 mt-6">
            <Skeleton className="h-12 w-3/4" />
          </div>
          <div className="flex justify-end space-x-2 mt-8">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsList({
  flashcards,
  pagination,
  isLoading,
  isInitialLoading = false,
  onPageChange,
  onEditFlashcard,
  onDeleteFlashcard,
}: FlashcardsListProps) {
  if (isInitialLoading || (isLoading && flashcards.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <FlashcardSkeleton key={index} />
          ))}
      </div>
    );
  }

  if (!isLoading && flashcards.length === 0) {
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
