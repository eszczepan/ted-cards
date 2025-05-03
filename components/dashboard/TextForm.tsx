import { Textarea } from "@/components/ui/textarea";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { InlineAlert } from "@/components/shared/InlineAlert";
import { CharacterCounter } from "@/components/shared/CharacterCounter";
import { motion } from "framer-motion";
import { GenerationFormBase } from "./GenerationForm";

type TextFormProps = {
  control: Control<GenerationFormBase>;
  errors: FieldErrors<GenerationFormBase>;
  isLoading: boolean;
  sourceText: string;
};

export function TextForm({ control, errors, isLoading, sourceText }: TextFormProps) {
  return (
    <motion.div
      key="text-input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-2"
    >
      <label htmlFor="source-text" className="block text-sm font-medium">
        Source Text
      </label>
      <Controller
        name="source_text"
        control={control}
        render={({ field }) => (
          <Textarea
            id="source-text"
            placeholder="Enter the text from which you want to generate flashcards..."
            disabled={isLoading}
            className="min-h-[200px]"
            {...field}
            value={field.value || ""}
          />
        )}
      />
      <CharacterCounter currentLength={sourceText.length} maxLength={15000} />
      {errors.source_text && <InlineAlert message={String(errors.source_text.message || "")} variant="error" />}
    </motion.div>
  );
}
