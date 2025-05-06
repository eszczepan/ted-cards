import { Button } from "@/components/ui/button";
import { SkeletonLoader } from "@/components/shared/SkeletonLoader";
import { InlineAlert } from "@/components/shared/InlineAlert";
import { ProposalCard } from "@/components/dashboard/ProposalCard";
import { FlashcardProposalDTO, FLASHCARD_PROPOSAL_STATUS } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

type ProposalListProps = {
  proposals: FlashcardProposalDTO[];
  isLoading: boolean;
  isSaving: boolean;
  onSaveAll: () => void;
  onSaveAccepted: () => void;
  onUpdateProposal: (updatedProposal: FlashcardProposalDTO) => void;
  error: string | null;
};

export function ProposalList({
  proposals,
  isLoading,
  isSaving,
  onSaveAll,
  onSaveAccepted,
  onUpdateProposal,
  error,
}: ProposalListProps) {
  const safeProposals = Array.isArray(proposals) ? proposals : [];
  const acceptedCount = safeProposals.filter(
    (p) => p.status === FLASHCARD_PROPOSAL_STATUS.ACCEPTED || p.status === FLASHCARD_PROPOSAL_STATUS.EDITED
  ).length;
  const rejectedCount = safeProposals.filter((p) => p.status === FLASHCARD_PROPOSAL_STATUS.REJECTED).length;
  const totalCount = safeProposals.length;

  if (isLoading) {
    return <SkeletonLoader count={3} height={200} />;
  }

  if (error) {
    return <InlineAlert message={error} variant="error" />;
  }

  if (totalCount === 0 || totalCount === rejectedCount) {
    return <InlineAlert message="No flashcards generated yet. Try submitting the form above." variant="info" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {totalCount} flashcards generated • {acceptedCount} accepted/edited • {rejectedCount} rejected
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onSaveAll} disabled={isSaving || totalCount === 0}>
            {isSaving ? "Saving..." : `Save All (${totalCount})`}
          </Button>

          <Button onClick={onSaveAccepted} disabled={isSaving || acceptedCount === 0}>
            {isSaving ? "Saving..." : `Save Accepted (${acceptedCount})`}
          </Button>
        </div>
      </div>

      {error && <InlineAlert message={error} variant="error" />}

      <AnimatePresence>
        <div className="space-y-4">
          {safeProposals.map(
            (proposal) =>
              proposal.status !== FLASHCARD_PROPOSAL_STATUS.REJECTED && (
                <motion.div
                  key={proposal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProposalCard proposal={proposal} onUpdate={onUpdateProposal} />
                </motion.div>
              )
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
