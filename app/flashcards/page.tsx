"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import FlashcardsToolbar from "@/components/flashcards/FlashcardsToolbar";
import FlashcardsList from "@/components/flashcards/FlashcardsList";
import FlashcardEditModal from "@/components/flashcards/FlashcardEditModal";
import FlashcardDeleteModal from "@/components/flashcards/FlashcardDeleteModal";
import FlashcardCreateModal from "@/components/flashcards/FlashcardCreateModal";
import useFlashcards from "@/components/hooks/useFlashcards";
import { FlashcardDTO, FlashcardFilterParams, FlashcardsPageParams, UpdateFlashcardDTO } from "@/types";
import FlashcardsHeader from "@/components/flashcards/FlashcardsHeader";

const DEFAULT_FILTERS: FlashcardsPageParams = {
  page: 1,
  limit: 10,
  searchTerm: "",
  cefr_level: undefined,
  sort_by: "created_at",
  sort_order: "desc",
};

function areFiltersDefault(filters: FlashcardsPageParams): boolean {
  return (
    filters.sort_by === DEFAULT_FILTERS.sort_by &&
    filters.sort_order === DEFAULT_FILTERS.sort_order &&
    (!filters.searchTerm || filters.searchTerm === "") &&
    filters.page === DEFAULT_FILTERS.page &&
    filters.cefr_level === DEFAULT_FILTERS.cefr_level
  );
}

export default function FlashcardsPage() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<FlashcardDTO | null>(null);
  const [searchInputValue, setSearchInputValue] = useState("");

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    flashcards,
    pagination,
    isLoading,
    isInitialLoading,
    isError,
    fetchFlashcards,
    deleteFlashcard,
    updateFlashcard,
    createFlashcard,
  } = useFlashcards();

  const [filterParams, setFilterParams] = useState<FlashcardsPageParams>(DEFAULT_FILTERS);

  useEffect(() => {
    fetchFlashcards(filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFlashcards]);

  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchInputValue(term);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        const updatedFilters = {
          ...filterParams,
          searchTerm: term,
          page: 1,
        };

        setFilterParams(updatedFilters);
        fetchFlashcards(updatedFilters);
      }, 500);
    },
    [filterParams, fetchFlashcards]
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleFilterChange = (newFilters: Partial<FlashcardFilterParams>) => {
    const updatedFilters = {
      ...filterParams,
      ...newFilters,
    };

    setFilterParams(updatedFilters);
    fetchFlashcards(updatedFilters);
  };

  const handleResetAll = (defaultParams: FlashcardsPageParams) => {
    if (areFiltersDefault(filterParams)) {
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchInputValue("");

    setFilterParams(defaultParams);
    fetchFlashcards(defaultParams);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = {
      ...filterParams,
      page,
    };

    setFilterParams(updatedFilters);
    fetchFlashcards(updatedFilters);
  };

  const handleEditFlashcard = (flashcard: FlashcardDTO) => {
    setSelectedFlashcard(flashcard);
    setEditModalOpen(true);
  };

  const handleSaveFlashcard = async (id: string, data: UpdateFlashcardDTO) => {
    try {
      await updateFlashcard(id, data);
      setEditModalOpen(false);
      setSelectedFlashcard(null);
    } catch (error) {
      console.error("Failed to save edit:", error);
      setEditModalOpen(false);
      setSelectedFlashcard(null);
    }
  };

  const handleDeleteFlashcard = (flashcard: FlashcardDTO) => {
    setSelectedFlashcard(flashcard);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteFlashcard(id);
      setDeleteModalOpen(false);
      setSelectedFlashcard(null);
    } catch (error) {
      console.error("Failed to delete:", error);
      setDeleteModalOpen(false);
      setSelectedFlashcard(null);
    }
  };

  const handleCreateFlashcard = async (data: {
    front_content: string;
    back_content: string;
    front_language: string;
    back_language: string;
    cefr_level: string;
  }) => {
    try {
      await createFlashcard(data);
      setCreateModalOpen(false);
      fetchFlashcards(filterParams);
    } catch (error) {
      console.error("Failed to create flashcard:", error);
    }
  };

  return (
    <>
      <FlashcardsHeader
        totalFlashcards={pagination.total}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        onCreateNew={() => setCreateModalOpen(true)}
      />

      <FlashcardsToolbar
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onReset={handleResetAll}
        searchValue={searchInputValue}
        isInitialLoading={isInitialLoading}
        currentFilters={filterParams}
      />

      {isError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          <p className="font-medium">Error loading flashcards</p>
          <p className="text-sm">{isError.message}</p>
        </div>
      )}

      <FlashcardsList
        flashcards={flashcards}
        pagination={pagination}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        onPageChange={handlePageChange}
        onEditFlashcard={handleEditFlashcard}
        onDeleteFlashcard={handleDeleteFlashcard}
      />

      <FlashcardEditModal
        isOpen={editModalOpen}
        flashcard={selectedFlashcard}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedFlashcard(null);
        }}
        onSave={handleSaveFlashcard}
      />

      <FlashcardDeleteModal
        isOpen={deleteModalOpen}
        flashcard={selectedFlashcard}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedFlashcard(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <FlashcardCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateFlashcard}
      />
    </>
  );
}
