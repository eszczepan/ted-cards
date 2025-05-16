"use client";

import { useState } from "react";
import FlashcardsHeader from "@/components/flashcards/FlashcardsHeader";
import FlashcardsToolbar from "@/components/flashcards/FlashcardsToolbar";
import FlashcardsList from "@/components/flashcards/FlashcardsList";
import { FlashcardDTO, FlashcardFilterParams } from "@/types";

const mockFlashcards: FlashcardDTO[] = [
  {
    id: "1",
    front_content: "Hello",
    back_content: "Cześć",
    front_language: "en",
    back_language: "pl",
    cefr_level: "A1",
    source: "manual",
    source_youtube_url: null,
    generation_id: null,
    status: "active",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "2",
    front_content: "Goodbye",
    back_content: "Do widzenia",
    front_language: "en",
    back_language: "pl",
    cefr_level: "A1",
    source: "manual",
    source_youtube_url: null,
    generation_id: null,
    status: "active",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "3",
    front_content: "Thank you",
    back_content: "Dziękuję",
    front_language: "en",
    back_language: "pl",
    cefr_level: "A1",
    source: "manual",
    source_youtube_url: null,
    generation_id: null,
    status: "active",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Mock pagination data
const mockPagination = {
  page: 1,
  limit: 10,
  total: 3,
  pages: 1,
};

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>(mockFlashcards);
  const [pagination, setPagination] = useState(mockPagination);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = (page: number) => {
    console.log(`Changing to page ${page}`);
    // In a real implementation, this would fetch the new page
  };

  const handleEditFlashcard = (flashcard: FlashcardDTO) => {
    console.log(`Edit flashcard with id ${flashcard.id}`);
    // In a real implementation, this would open the edit modal
  };

  const handleDeleteFlashcard = (flashcard: FlashcardDTO) => {
    console.log(`Delete flashcard with id ${flashcard.id}`);
    // In a real implementation, this would open the delete modal
  };

  const handleSearchChange = (term: string) => {
    console.log(`Search term: ${term}`);
    // In a real implementation, this would update the search term and fetch results
  };

  const handleFilterChange = (filters: FlashcardFilterParams) => {
    console.log("Filters changed:", filters);
    // In a real implementation, this would update the filters and fetch results
  };

  return (
    <div className="container mx-auto py-8">
      <FlashcardsHeader totalFlashcards={pagination.total} />
      <FlashcardsToolbar onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} />
      <FlashcardsList
        flashcards={flashcards}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEditFlashcard={handleEditFlashcard}
        onDeleteFlashcard={handleDeleteFlashcard}
      />
    </div>
  );
}
