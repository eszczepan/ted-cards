import { NextResponse } from "next/server";
import { createFlashcardsSchema } from "./schema";
import { FlashcardService } from "@/lib/services/flashcard.service";
import { createClient } from "@/supabase/supabase.server";
import { CefrLevel, FlashcardStatus } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const cefr_level = searchParams.get("cefr_level") as CefrLevel | null;
    const status = (searchParams.get("status") as FlashcardStatus | null) || "active";

    const sort_by = searchParams.get("sort_by") || "created_at";
    const sort_order = (searchParams.get("sort_order") || "desc") as "asc" | "desc";

    const page = parseInt(searchParams.get("page") || "1", 12);
    const limit = parseInt(searchParams.get("limit") || "12", 12);

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
      const result = await flashcardService.getFlashcards(user.id, {
        page,
        limit,
        search,
        cefr_level,
        status,
        sort_by,
        sort_order,
      });

      return NextResponse.json({
        data: result.flashcards,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch flashcards",
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

export async function POST(request: Request) {
  try {
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

    const flashcardService = new FlashcardService();

    try {
      const createdFlashcards = await flashcardService.createFlashcards(
        user_id,
        validatedData.flashcards,
        validatedData.generation_id || null
      );

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
