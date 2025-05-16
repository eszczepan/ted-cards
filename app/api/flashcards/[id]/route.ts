import { NextResponse } from "next/server";
import { FlashcardService } from "@/lib/services/flashcard.service";
import { createClient } from "@/supabase/supabase.server";
import { updateFlashcardSchema } from "../schema";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "User must be logged in to access flashcards",
        },
        { status: 401 }
      );
    }

    const flashcardService = new FlashcardService();

    try {
      const flashcard = await flashcardService.getFlashcardById(id, user.id);

      if (!flashcard) {
        return NextResponse.json(
          {
            error: "Flashcard not found",
            details: "The requested flashcard does not exist or you don't have access to it",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(flashcard);
    } catch (error) {
      console.error("Error fetching flashcard:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch flashcard",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing flashcard request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const body = await request.json();
    const validationResult = updateFlashcardSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "User must be logged in to update flashcards",
        },
        { status: 401 }
      );
    }

    const flashcardService = new FlashcardService();

    try {
      const existingFlashcard = await flashcardService.getFlashcardById(id, user.id);

      if (!existingFlashcard) {
        return NextResponse.json(
          {
            error: "Flashcard not found",
            details: "The requested flashcard does not exist or you don't have access to it",
          },
          { status: 404 }
        );
      }

      const updatedFlashcard = await flashcardService.updateFlashcard(id, user.id, validatedData);

      return NextResponse.json(updatedFlashcard);
    } catch (error) {
      console.error("Error updating flashcard:", error);
      return NextResponse.json(
        {
          error: "Failed to update flashcard",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing flashcard update request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "User must be logged in to delete flashcards",
        },
        { status: 401 }
      );
    }

    const flashcardService = new FlashcardService();

    try {
      const existingFlashcard = await flashcardService.getFlashcardById(id, user.id);

      if (!existingFlashcard) {
        return NextResponse.json(
          {
            error: "Flashcard not found",
            details: "The requested flashcard does not exist or you don't have access to it",
          },
          { status: 404 }
        );
      }

      await flashcardService.deleteFlashcard(id, user.id);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      return NextResponse.json(
        {
          error: "Failed to delete flashcard",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing flashcard deletion request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
