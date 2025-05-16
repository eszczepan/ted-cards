"use client";

import { useState } from "react";
import { FlashcardDTO } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface FlashcardDeleteModalProps {
  isOpen: boolean;
  flashcard: FlashcardDTO | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function FlashcardDeleteModal({ isOpen, flashcard, onClose, onConfirm }: FlashcardDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!flashcard) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm(flashcard.id);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete flashcard");
      console.error("Error deleting flashcard:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Truncate content for display if too long
  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Flashcard</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this flashcard? This action cannot be undone.
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="font-medium">
                <span className="text-muted-foreground">Front:</span>{" "}
                {flashcard ? truncateContent(flashcard.front_content) : ""}
              </p>
              <p className="font-medium mt-2">
                <span className="text-muted-foreground">Back:</span>{" "}
                {flashcard ? truncateContent(flashcard.back_content) : ""}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && <div className="text-sm font-medium text-destructive mb-4">{error}</div>}

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
