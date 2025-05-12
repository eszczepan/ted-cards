import { NextResponse } from "next/server";
import { createFlashcardsSchema } from "./schema";
import { FlashcardService } from "@/lib/services/flashcard.service";
import { createClient } from "@/supabase/supabase.server";

export async function POST(request: Request) {
  try {
    // 1. Parse and validate request data
    const body = await request.json();
    const validationResult = createFlashcardsSchema.safeParse(body);

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

    // 2. Create Supabase client and get authenticated user ID
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "User must be logged in to create flashcards",
        },
        { status: 401 }
      );
    }

    const user_id = user.id;

    // 3. Use FlashcardService to create flashcards
    const flashcardService = new FlashcardService();

    try {
      // Create flashcards in database
      const createdFlashcards = await flashcardService.createFlashcards(
        user_id,
        validatedData.flashcards,
        validatedData.generation_id || null
      );

      // Return successful response
      return NextResponse.json(
        {
          success: true,
          created_count: createdFlashcards.length,
          flashcards: createdFlashcards,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Flashcard service error:", error);
      return NextResponse.json(
        {
          error: "Failed to create flashcards",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing flashcard creation request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
