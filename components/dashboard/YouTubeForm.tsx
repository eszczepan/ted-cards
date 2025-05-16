import { Input } from "@/components/ui/input";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { InlineAlert } from "@/components/shared/InlineAlert";
import { motion } from "framer-motion";
import { GenerationFormBase } from "./GenerationForm";

type YouTubeFormProps = {
  control: Control<GenerationFormBase>;
  errors: FieldErrors<GenerationFormBase>;
  isLoading: boolean;
};

export function YouTubeForm({ control, errors, isLoading }: YouTubeFormProps) {
  return (
    <motion.div
      key="youtube-input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-2"
    >
      <label htmlFor="youtube-url" className="block text-sm font-medium">
        YouTube URL
      </label>
      <Controller
        name="source_youtube_url"
        control={control}
        render={({ field }) => (
          <>
            <Input
              id="youtube-url"
              placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
              disabled={isLoading}
              {...field}
              value={field.value || ""}
            />
            <p
              className="text-xs text-muted-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
              onClick={(e) => {
                e.preventDefault();
                field.onChange("https://www.youtube.com/watch?v=siMsjlvj4p0");
              }}
            >
              Click here to try example video
            </p>
          </>
        )}
      />
      {errors.source_youtube_url && (
        <InlineAlert message={String(errors.source_youtube_url.message || "")} variant="error" />
      )}
    </motion.div>
  );
}
