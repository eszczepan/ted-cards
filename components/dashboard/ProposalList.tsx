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
  // Count accepted/edited proposals
  const acceptedCount = proposals.filter(
    (p) => p.status === FLASHCARD_PROPOSAL_STATUS.ACCEPTED || p.status === FLASHCARD_PROPOSAL_STATUS.EDITED,
  ).length;

  // Count non-rejected proposals
  const nonRejectedCount = proposals.filter((p) => p.status !== FLASHCARD_PROPOSAL_STATUS.REJECTED).length;

  if (isLoading) {
    return <SkeletonLoader count={3} height={200} />;
  }

  if (error) {
    return <InlineAlert message={error} variant="error" />;
  }

  if (proposals.length === 0) {
    return <InlineAlert message="No flashcards generated yet. Try submitting the form above." variant="info" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {proposals.length} flashcards generated • {acceptedCount} accepted/edited •{" "}
            {proposals.length - nonRejectedCount} rejected
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onSaveAll} disabled={isSaving || nonRejectedCount === 0}>
            {isSaving ? "Saving..." : `Save All (${nonRejectedCount})`}
          </Button>

          <Button onClick={onSaveAccepted} disabled={isSaving || acceptedCount === 0}>
            {isSaving ? "Saving..." : `Save Accepted (${acceptedCount})`}
          </Button>
        </div>
      </div>

      {error && <InlineAlert message={error} variant="error" />}

      <AnimatePresence>
        <div className="space-y-4">
          {proposals.map((proposal) => (
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
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
