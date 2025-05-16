import { useState, useCallback, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FlashcardFilterParams, FlashcardsPageParams, CefrLevel } from "@/types";
import { debounce } from "@/lib/utils/index";

interface UseFlashcardFiltersReturnType {
  searchTerm: string;
  filters: FlashcardFilterParams;
  page: number;
  limit: number;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<FlashcardFilterParams>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  buildQueryParams: () => FlashcardsPageParams;
}

/**
 * Hook to manage flashcard filters, search, and pagination
 * Syncs state with URL query parameters
 * @returns Object with filter state and methods
 */
function useFlashcardFilters(): UseFlashcardFiltersReturnType {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Parse initial state from URL query parameters
  const initialSearchTerm = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialLimit = parseInt(searchParams.get("limit") || "10", 10);
  const initialCefrLevel = searchParams.get("cefr_level") as CefrLevel | undefined;
  const initialSortBy = (searchParams.get("sort_by") || "created_at") as "created_at" | "cefr_level" | "front_content";
  const initialSortOrder = (searchParams.get("sort_order") || "desc") as "asc" | "desc";

  // Set up local state
  const [searchTerm, setSearchTermState] = useState<string>(initialSearchTerm);
  const [page, setPageState] = useState<number>(initialPage);
  const [limit] = useState<number>(initialLimit);
  const [filters, setFiltersState] = useState<FlashcardFilterParams>({
    cefr_level: initialCefrLevel,
    sort_by: initialSortBy,
    sort_order: initialSortOrder,
  });

  // Update URL when filters change
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.set("search", searchTerm);
    }

    if (page > 1) {
      params.set("page", page.toString());
    }

    if (limit !== 10) {
      params.set("limit", limit.toString());
    }

    if (filters.cefr_level) {
      params.set("cefr_level", filters.cefr_level);
    }

    if (filters.sort_by && filters.sort_by !== "created_at") {
      params.set("sort_by", filters.sort_by);
    }

    if (filters.sort_order && filters.sort_order !== "desc") {
      params.set("sort_order", filters.sort_order);
    }

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(url);
  }, [pathname, router, searchTerm, page, limit, filters]);

  // Debounce URL updates to avoid excessive history entries
  const debouncedUpdateUrl = useCallback(debounce(updateUrl, 300), [updateUrl]);

  // Trigger URL update when filters change
  useEffect(() => {
    debouncedUpdateUrl();
  }, [searchTerm, page, filters, debouncedUpdateUrl]);

  // Handler functions with URL sync
  const setSearchTerm = (term: string) => {
    setSearchTermState(term);
    setPageState(1); // Reset to first page on search change
  };

  const setFilters = (newFilters: Partial<FlashcardFilterParams>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setPageState(1); // Reset to first page on filter change
  };

  const setPage = (newPage: number) => {
    setPageState(newPage);
  };

  const resetFilters = () => {
    setSearchTermState("");
    setPageState(1);
    setFiltersState({
      sort_by: "created_at",
      sort_order: "desc",
    });
  };

  // Build query parameters for API requests
  const buildQueryParams = (): FlashcardsPageParams => {
    return {
      searchTerm: searchTerm,
      page,
      limit,
      ...filters,
    };
  };

  return {
    searchTerm,
    filters,
    page,
    limit,
    setSearchTerm,
    setFilters,
    setPage,
    resetFilters,
    buildQueryParams,
  };
}

export default useFlashcardFilters;
