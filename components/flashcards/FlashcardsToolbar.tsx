"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CefrLevel, CEFR_LEVEL, FlashcardFilterParams } from "@/types";

interface FlashcardsToolbarProps {
  onSearchChange: (term: string) => void;
  onFilterChange: (filters: FlashcardFilterParams) => void;
}

export default function FlashcardsToolbar({ onSearchChange, onFilterChange }: FlashcardsToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FlashcardFilterParams>({
    sort_by: "created_at",
    sort_order: "desc",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCefrLevelChange = (value: string) => {
    // If value is 'all', set cefr_level to undefined
    const cefrLevel = value === "all" ? undefined : (value as CefrLevel);
    const newFilters = { ...filters, cefr_level: cefrLevel };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortByChange = (value: "created_at" | "cefr_level" | "front_content") => {
    const newFilters = { ...filters, sort_by: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    const newFilters = { ...filters, sort_order: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      sort_by: "created_at" as const,
      sort_order: "desc" as const,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    setSearchTerm("");
    onSearchChange("");
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* CEFR Level Filter */}
        <div className="w-40">
          <Select value={filters.cefr_level || "all"} onValueChange={handleCefrLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="CEFR Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All levels</SelectItem>
                {Object.values(CEFR_LEVEL).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By Filter */}
        <div className="w-40">
          <Select
            value={filters.sort_by}
            onValueChange={(value) => handleSortByChange(value as "created_at" | "cefr_level" | "front_content")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="created_at">Creation date</SelectItem>
                <SelectItem value="cefr_level">CEFR level</SelectItem>
                <SelectItem value="front_content">Content</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order Filter */}
        <div className="w-40">
          <Select value={filters.sort_order} onValueChange={(value) => handleSortOrderChange(value as "asc" | "desc")}>
            <SelectTrigger>
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters Button */}
        <Button variant="outline" size="sm" onClick={handleResetFilters} className="ml-auto">
          Reset filters
        </Button>
      </div>
    </div>
  );
}
