"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FlashcardsHeaderProps {
  totalFlashcards?: number;
  isLoading?: boolean;
  isInitialLoading?: boolean;
  onCreateNew?: () => void;
}

export default function FlashcardsHeader({
  totalFlashcards = 0,
  isLoading = false,
  isInitialLoading = false,
  onCreateNew,
}: FlashcardsHeaderProps) {
  const showSkeleton = isInitialLoading || isLoading;

  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">My Flashcards</h1>
        <div className="text-gray-500 mt-2 h-6">
          {showSkeleton ? (
            <div className="flex items-center gap-2">
              <span>Total flashcards:</span>
              <Skeleton className="h-4 w-8 inline-block" />
            </div>
          ) : (
            <p>Total flashcards: {totalFlashcards}</p>
          )}
        </div>
      </div>
      <Button onClick={onCreateNew} className="flex items-center gap-2">
        <Plus size={16} />
        <span>Add Flashcard</span>
      </Button>
    </div>
  );
}
