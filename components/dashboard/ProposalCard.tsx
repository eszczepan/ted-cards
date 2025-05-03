"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InlineAlert } from "@/components/shared/InlineAlert";
import { motion } from "framer-motion";
import { FlashcardProposalDTO, CefrLevel, CEFR_LEVEL, FLASHCARD_PROPOSAL_STATUS } from "@/types";
import { z } from "zod";

type ProposalCardProps = {
  proposal: FlashcardProposalDTO;
  onUpdate: (updatedProposal: FlashcardProposalDTO) => void;
};

// Schema for edit validation
const editSchema = z.object({
  front_content: z
    .string()
    .min(1, "Front content is required")
    .max(200, "Front content must be less than 200 characters"),
  back_content: z.string().min(1, "Back content is required").max(500, "Back content must be less than 500 characters"),
  cefr_level: z.enum([CEFR_LEVEL.A1, CEFR_LEVEL.A2, CEFR_LEVEL.B1, CEFR_LEVEL.B2, CEFR_LEVEL.C1, CEFR_LEVEL.C2]),
});

type EditFormValues = z.infer<typeof editSchema>;

export function ProposalCard({ proposal, onUpdate }: ProposalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<EditFormValues>({
    front_content: proposal.front_content,
    back_content: proposal.back_content,
    cefr_level: proposal.cefr_level,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Define available CEFR levels
  const cefrLevels = [
    { value: CEFR_LEVEL.A1, label: "A1 - Beginner" },
    { value: CEFR_LEVEL.A2, label: "A2 - Elementary" },
    { value: CEFR_LEVEL.B1, label: "B1 - Intermediate" },
    { value: CEFR_LEVEL.B2, label: "B2 - Upper Intermediate" },
    { value: CEFR_LEVEL.C1, label: "C1 - Advanced" },
    { value: CEFR_LEVEL.C2, label: "C2 - Proficient" },
  ];

  // Handle CEFR level change
  function handleCefrChange(value: CefrLevel) {
    if (!isEditing) {
      // If not in edit mode, directly update the proposal
      onUpdate({
        ...proposal,
        cefr_level: value,
      });
    } else {
      // If in edit mode, update the local state
      setEditValues({
        ...editValues,
        cefr_level: value,
      });
    }
  }

  // Handle edit form input change
  function handleEditChange(field: keyof EditFormValues, value: string) {
    setEditValues({
      ...editValues,
      [field]: value,
    });

    // Clear validation error for this field if it exists
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  }

  // Validate form data
  function validateForm(): boolean {
    try {
      editSchema.parse(editValues);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setValidationErrors(newErrors);
      }
      return false;
    }
  }

  // Handle Save edit button click
  function handleSaveEdit() {
    if (validateForm()) {
      onUpdate({
        ...proposal,
        front_content: editValues.front_content,
        back_content: editValues.back_content,
        cefr_level: editValues.cefr_level,
        status: FLASHCARD_PROPOSAL_STATUS.EDITED,
      });
      setIsEditing(false);
    }
  }

  // Handle Cancel edit button click
  function handleCancelEdit() {
    setEditValues({
      front_content: proposal.front_content,
      back_content: proposal.back_content,
      cefr_level: proposal.cefr_level,
    });
    setValidationErrors({});
    setIsEditing(false);
  }

  // Handle Accept button click
  function handleAccept() {
    onUpdate({
      ...proposal,
      status: FLASHCARD_PROPOSAL_STATUS.ACCEPTED,
    });
  }

  // Handle Reject button click
  function handleReject() {
    onUpdate({
      ...proposal,
      status: FLASHCARD_PROPOSAL_STATUS.REJECTED,
    });
  }

  // Handle Edit button click
  function handleEdit() {
    setIsEditing(true);
  }

  // Card border color based on status
  const statusBorderColors = {
    [FLASHCARD_PROPOSAL_STATUS.ACCEPTED]: "border-green-500",
    [FLASHCARD_PROPOSAL_STATUS.EDITED]: "border-blue-500",
    [FLASHCARD_PROPOSAL_STATUS.REJECTED]: "border-red-500",
    [FLASHCARD_PROPOSAL_STATUS.PENDING]: "border-yellow-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-6 rounded-lg border-2 ${
        statusBorderColors[proposal.status || FLASHCARD_PROPOSAL_STATUS.ACCEPTED]
      } bg-card shadow-sm`}
    >
      <div className="space-y-4">
        {!isEditing ? (
          // View Mode
          <>
            <div className="space-y-2">
              <div className="font-medium text-lg">Front Side</div>
              <div className="p-3 bg-muted rounded-md">{proposal.front_content}</div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-lg">Back Side</div>
              <div className="p-3 bg-muted rounded-md">{proposal.back_content}</div>
            </div>
          </>
        ) : (
          // Edit Mode
          <>
            <div className="space-y-2">
              <label htmlFor={`front-${proposal.id}`} className="font-medium text-lg">
                Front Side
              </label>
              <Input
                id={`front-${proposal.id}`}
                value={editValues.front_content}
                onChange={(e) => handleEditChange("front_content", e.target.value)}
                placeholder="Enter front side content"
              />
              {validationErrors.front_content && (
                <InlineAlert message={validationErrors.front_content} variant="error" />
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor={`back-${proposal.id}`} className="font-medium text-lg">
                Back Side
              </label>
              <Textarea
                id={`back-${proposal.id}`}
                value={editValues.back_content}
                onChange={(e) => handleEditChange("back_content", e.target.value)}
                placeholder="Enter back side content"
              />
              {validationErrors.back_content && <InlineAlert message={validationErrors.back_content} variant="error" />}
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t gap-4">
          <div className="space-y-2 w-full sm:w-1/3">
            <div className="font-medium text-sm">CEFR Level</div>
            <Select
              value={isEditing ? editValues.cefr_level : proposal.cefr_level}
              onValueChange={handleCefrChange as (value: string) => void}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {cefrLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 self-end sm:self-auto">
            {isEditing ? (
              // Edit Mode Actions
              <>
                <Button onClick={handleSaveEdit} variant="default">
                  Save
                </Button>
                <Button onClick={handleCancelEdit} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              // View Mode Actions
              <>
                {proposal.status === FLASHCARD_PROPOSAL_STATUS.REJECTED && (
                  <Button onClick={handleAccept} variant="default">
                    Accept
                  </Button>
                )}
                <Button onClick={handleEdit} variant="outline">
                  Edit
                </Button>
                {proposal.status !== FLASHCARD_PROPOSAL_STATUS.REJECTED && (
                  <Button onClick={handleReject} variant="destructive">
                    Reject
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
