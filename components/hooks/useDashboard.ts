"use client";

import { useState } from "react";
import {
  CreateGenerationCommand,
  FlashcardProposalDTO,
  SourceType,
  SOURCE_TYPE,
  FLASHCARD_PROPOSAL_STATUS,
  CreateFlashcardDTO,
} from "@/types";

export type DashboardViewModel = {
  generationState: "idle" | "loading" | "success" | "error";
  saveState: "idle" | "loading" | "success" | "error";
  generationError: string | null;
  saveError: string | null;
  proposals: FlashcardProposalDTO[];
  generationId: string | null;
  formInput: Partial<CreateGenerationCommand>;
  selectedSourceType: SourceType;
};

export function useDashboard() {
  const [state, setState] = useState<DashboardViewModel>({
    generationState: "idle",
    saveState: "idle",
    generationError: null,
    saveError: null,
    proposals: [],
    generationId: null,
    formInput: {
      source_type: SOURCE_TYPE.YOUTUBE,
      front_language: "en",
      back_language: "pl",
    },
    selectedSourceType: SOURCE_TYPE.YOUTUBE,
  });

  // Form input handlers
  function handleInputChange(field: keyof CreateGenerationCommand, value: string) {
    setState((prev) => ({
      ...prev,
      formInput: {
        ...prev.formInput,
        [field]: value,
      },
    }));
  }

  function handleSourceTypeChange(sourceType: SourceType) {
    setState((prev) => ({
      ...prev,
      selectedSourceType: sourceType,
      formInput: {
        ...prev.formInput,
        source_type: sourceType,
        // Clear the irrelevant field based on the new source type
        ...(sourceType === SOURCE_TYPE.YOUTUBE ? { source_text: "" } : { source_youtube_url: "" }),
      },
    }));
  }

  // API interaction handlers
  async function handleGenerateSubmit(data: CreateGenerationCommand) {
    if (state.generationState === "loading") return;

    setState((prev) => ({
      ...prev,
      generationState: "loading",
      generationError: null,
    }));

    try {
      const requestData = { ...data };

      if (data.source_type === SOURCE_TYPE.YOUTUBE) {
        // When using YouTube source, ensure source_text is valid but empty
        requestData.source_text = requestData.source_text || "";
      } else if (data.source_type === SOURCE_TYPE.TEXT) {
        // When using Text source, ensure source_youtube_url is empty
        requestData.source_youtube_url = "";
      }

      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.details?._errors?.[0] || "Failed to generate flashcards");
      }

      const responseData = await response.json();

      // Set all proposals to ACCEPTED by default
      const proposalsWithDefaultStatus = responseData.flashcard_proposals.map((proposal: FlashcardProposalDTO) => ({
        ...proposal,
        status: FLASHCARD_PROPOSAL_STATUS.ACCEPTED,
      }));

      setState((prev) => ({
        ...prev,
        generationState: "success",
        proposals: proposalsWithDefaultStatus,
        generationId: responseData.id,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        generationState: "error",
        generationError: error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }

  function handleUpdateProposal(updatedProposal: FlashcardProposalDTO) {
    setState((prev) => ({
      ...prev,
      proposals: prev.proposals.map((proposal) => (proposal.id === updatedProposal.id ? updatedProposal : proposal)),
    }));
  }

  async function handleSaveAccepted() {
    if (state.saveState === "loading") return;

    const acceptedProposals = state.proposals.filter(
      (proposal) =>
        proposal.status === FLASHCARD_PROPOSAL_STATUS.ACCEPTED || proposal.status === FLASHCARD_PROPOSAL_STATUS.EDITED,
    );

    if (acceptedProposals.length === 0) return;

    setState((prev) => ({
      ...prev,
      saveState: "loading",
      saveError: null,
    }));

    try {
      const flashcardsToSave: CreateFlashcardDTO[] = acceptedProposals.map((proposal) => ({
        front_content: proposal.front_content,
        back_content: proposal.back_content,
        front_language: proposal.front_language,
        back_language: proposal.back_language,
        cefr_level: proposal.cefr_level,
        source: proposal.source,
        source_youtube_url: state.formInput.source_youtube_url,
      }));

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcards: flashcardsToSave,
          generation_id: state.generationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save flashcards");
      }

      await response.json();

      setState((prev) => ({
        ...prev,
        saveState: "success",
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        saveState: "error",
        saveError: error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }

  async function handleSaveAll() {
    if (state.saveState === "loading") return;

    const nonRejectedProposals = state.proposals.filter(
      (proposal) => proposal.status !== FLASHCARD_PROPOSAL_STATUS.REJECTED,
    );

    if (nonRejectedProposals.length === 0) return;

    setState((prev) => ({
      ...prev,
      saveState: "loading",
      saveError: null,
    }));

    try {
      const flashcardsToSave: CreateFlashcardDTO[] = nonRejectedProposals.map((proposal) => ({
        front_content: proposal.front_content,
        back_content: proposal.back_content,
        front_language: proposal.front_language,
        back_language: proposal.back_language,
        cefr_level: proposal.cefr_level,
        source: proposal.source,
        source_youtube_url: state.formInput.source_youtube_url,
      }));

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcards: flashcardsToSave,
          generation_id: state.generationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save flashcards");
      }

      await response.json();

      setState((prev) => ({
        ...prev,
        saveState: "success",
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        saveState: "error",
        saveError: error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  }

  return {
    ...state,
    handleInputChange,
    handleSourceTypeChange,
    handleGenerateSubmit,
    handleUpdateProposal,
    handleSaveAccepted,
    handleSaveAll,
  };
}
