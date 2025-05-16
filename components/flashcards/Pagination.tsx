"use client";

import { Button } from "@/components/ui/button";
import { PaginationDTO } from "@/types";

interface PaginationProps {
  pagination: PaginationDTO;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, pages, total } = pagination;

  // Generate page buttons
  const pageButtons = () => {
    const buttons = [];

    // Always show first page
    if (page > 1) {
      buttons.push(
        <Button key="first" variant="outline" size="sm" onClick={() => onPageChange(1)}>
          1
        </Button>
      );
    }

    // Show ellipsis if not showing first pages
    if (page > 3) {
      buttons.push(
        <span key="ellipsis-1" className="px-2">
          ...
        </span>
      );
    }

    // Show previous page if not first page
    if (page > 2) {
      buttons.push(
        <Button key={page - 1} variant="outline" size="sm" onClick={() => onPageChange(page - 1)}>
          {page - 1}
        </Button>
      );
    }

    // Current page
    buttons.push(
      <Button key={page} variant="default" size="sm" onClick={() => onPageChange(page)}>
        {page}
      </Button>
    );

    // Show next page if not last page
    if (page < pages - 1) {
      buttons.push(
        <Button key={page + 1} variant="outline" size="sm" onClick={() => onPageChange(page + 1)}>
          {page + 1}
        </Button>
      );
    }

    // Show ellipsis if not showing last pages
    if (page < pages - 2) {
      buttons.push(
        <span key="ellipsis-2" className="px-2">
          ...
        </span>
      );
    }

    // Always show last page if not first page
    if (page < pages) {
      buttons.push(
        <Button key="last" variant="outline" size="sm" onClick={() => onPageChange(pages)}>
          {pages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center">
      <div className="text-sm text-gray-500 mb-4 sm:mb-0">
        Showing {(page - 1) * pagination.limit + 1}-{Math.min(page * pagination.limit, total)} of {total} flashcards
      </div>

      <div className="flex space-x-1">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Button>

        {pageButtons()}

        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === pages}>
          <ChevronRightIcon className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
