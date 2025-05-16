import { useState, useCallback } from "react";
import {
  FlashcardDTO,
  PaginationDTO,
  UpdateFlashcardDTO,
  FlashcardsPageParams,
  FlashcardListResponseDTO,
} from "@/types";

interface UseFlashcardsReturnType {
  flashcards: FlashcardDTO[];
  pagination: PaginationDTO;
  isLoading: boolean;
  isError: Error | null;
  fetchFlashcards: (params: FlashcardsPageParams) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  updateFlashcard: (id: string, data: UpdateFlashcardDTO) => Promise<void>;
}

/**
 * Hook to manage flashcards, including fetching, updating, and deleting
 * @returns Object with flashcards data and operations
 */
function useFlashcards(): UseFlashcardsReturnType {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationDTO>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<Error | null>(null);

  /**
   * Fetch flashcards from the API
   * @param params - Query parameters for filtering, sorting, and pagination
   */
  const fetchFlashcards = useCallback(async (params: FlashcardsPageParams): Promise<void> => {
    setIsLoading(true);
    setIsError(null);

    try {
      // Convert parameters to query string
      const queryParams = new URLSearchParams();

      if (params.searchTerm) {
        queryParams.append("search", params.searchTerm);
      }

      if (params.cefr_level) {
        queryParams.append("cefr_level", params.cefr_level);
      }

      if (params.sort_by) {
        queryParams.append("sort_by", params.sort_by);
      }

      if (params.sort_order) {
        queryParams.append("sort_order", params.sort_order);
      }

      queryParams.append("page", params.page.toString());
      queryParams.append("limit", params.limit.toString());

      // Fetch data from API
      const response = await fetch(`/api/flashcards?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: FlashcardListResponseDTO = await response.json();

      setFlashcards(data.data);
      setPagination(data.pagination);
    } catch (error) {
      setIsError(error instanceof Error ? error : new Error("Unknown error occurred"));
      console.error("Error fetching flashcards:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a flashcard
   * @param id - ID of the flashcard to delete
   */
  const deleteFlashcard = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Update local state after successful deletion
      setFlashcards((prevFlashcards) => prevFlashcards.filter((flashcard) => flashcard.id !== id));

      // Update pagination total count
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (error) {
      setIsError(error instanceof Error ? error : new Error("Unknown error occurred"));
      console.error("Error deleting flashcard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update a flashcard
   * @param id - ID of the flashcard to update
   * @param data - New data for the flashcard
   */
  const updateFlashcard = useCallback(async (id: string, data: UpdateFlashcardDTO): Promise<void> => {
    setIsLoading(true);
    setIsError(null);

    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const updatedFlashcard: FlashcardDTO = await response.json();

      // Update local state with the updated flashcard
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((flashcard) => (flashcard.id === id ? updatedFlashcard : flashcard))
      );
    } catch (error) {
      setIsError(error instanceof Error ? error : new Error("Unknown error occurred"));
      console.error("Error updating flashcard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    flashcards,
    pagination,
    isLoading,
    isError,
    fetchFlashcards,
    deleteFlashcard,
    updateFlashcard,
  };
}

export default useFlashcards;
