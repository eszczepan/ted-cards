import { NextResponse } from "next/server";
import { createGenerationSchema } from "./schema";
import { GenerationService } from "@/lib/services/generation.service";
import { YoutubeService } from "@/lib/services/youtube.service";
import { createClient } from "@/supabase/supabase.server";

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

    // 2. Create Supabase client and get authenticated user ID
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "User must be logged in to generate flashcards",
        },
        { status: 401 }
      );
    }

    const user_id = user.id;

    // 3. Use YoutubeService to get transcript
    if (validatedData.source_type === "youtube") {
      const youtubeService = new YoutubeService();
      const transcript = await youtubeService.transcriptWithCaptionsScraper(validatedData.source_youtube_url);
      validatedData.source_text = transcript;
    }

    // Ensure source_text is defined
    if (!validatedData.source_text) {
      return NextResponse.json(
        {
          error: `Failed to get text content from ${validatedData.source_type} source.`,
          details: validatedData,
        },
        { status: 400 }
      );
    }

    try {
      // 4. Use GenerationService to generate flashcards
      const generationService = new GenerationService();
      // Generate flashcard proposals
      const generationResult = await generationService.generateFlashcards(user_id, {
        source_type: validatedData.source_type,
        source_text: validatedData.source_text,
        front_language: validatedData.front_language,
        back_language: validatedData.back_language,
        source_youtube_url: validatedData.source_youtube_url,
      });

      return NextResponse.json(
        {
          id: generationResult.generationId,
          status: "completed",
          flashcard_proposals: generationResult.proposals,
          generation_duration: generationResult.generationDuration,
          created_at: generationResult.createdAt,
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
