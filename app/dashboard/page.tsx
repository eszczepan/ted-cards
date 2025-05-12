"use client";

import { GenerationForm } from "@/components/dashboard/GenerationForm";
import { ProposalList } from "@/components/dashboard/ProposalList";
import { useDashboard } from "@/components/hooks/useDashboard";

export default function Dashboard() {
  const {
    generationState,
    generationError,
    saveState,
    saveError,
    handleGenerateSubmit,
    handleUpdateProposal,
    handleSaveAccepted,
    handleSaveAll,
    proposals,
  } = useDashboard();

  const isLoading = generationState === "loading";
  const isSaving = saveState === "loading";

  return (
    <>
      <section className="w-full flex flex-col items-center mt-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Generate Flashcards</h2>
          <p className="text-muted-foreground">Generate flashcards from YouTube videos or text input.</p>
        </div>

        <GenerationForm onSubmit={handleGenerateSubmit} isLoading={isLoading} />
      </section>

      <section className="w-full px-1">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Generated Flashcards</h2>
          <p className="text-muted-foreground">Review, edit, and save your generated flashcards.</p>
        </div>

        <ProposalList
          proposals={proposals}
          isLoading={isLoading}
          isSaving={isSaving}
          onSaveAll={handleSaveAll}
          onSaveAccepted={handleSaveAccepted}
          onUpdateProposal={handleUpdateProposal}
          error={generationError || saveError}
        />
      </section>
    </>
  );
}
