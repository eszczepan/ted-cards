"use client";

import { GenerationForm } from "@/components/dashboard/GenerationForm";
import { ProposalList } from "@/components/dashboard/ProposalList";
import { useDashboard } from "@/components/hooks/useDashboard";
import { logout } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
        <section className="w-full flex flex-col items-center mt-6">
          <form action={logout}>
            <Button type="submit" className="mb-6 w-full max-w-xs bg-red-600 hover:bg-red-700 text-white">
              Log out
            </Button>
          </form>

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
      </main>

      <footer className="text-center text-sm text-muted-foreground py-4 mt-8 max-w-5xl mx-auto w-full">
        Ted Cards - 2025
      </footer>
    </div>
  );
}
