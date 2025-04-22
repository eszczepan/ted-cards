import { NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/supabase/supabase.server";
import { createGenerationSchema } from "./schema";
import { GenerationService } from "@/lib/services/generation.service";

export async function POST(request: Request) {
  try {
    // 1. Parse and validate request data
    const body = await request.json();
    const validationResult = createGenerationSchema.safeParse(body);

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

    // 2. Create Supabase client and get user ID
    const user_id = DEFAULT_USER_ID; // In production, this would come from auth

    // 3. Use GenerationService to generate flashcards proposals and create record
    const generationService = new GenerationService();

    try {
      // Generate flashcard proposals
      const generationResult = await generationService.generateFlashcards(
        user_id,
        validatedData
      );

      // Create generation record in database
      const { id, createdAt } = await generationService.createGenerationRecord(
        user_id,
        validatedData,
        generationResult
      );

      // Return response with generated flashcards proposals
      return NextResponse.json(
        {
          id,
          status: "completed",
          flashcard_proposals: generationResult.proposals,
          generation_duration: generationResult.generationDuration,
          created_at: new Date(createdAt),
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Generation service error:", error);
      return NextResponse.json(
        {
          error: "Failed to generate flashcards",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing generation request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
