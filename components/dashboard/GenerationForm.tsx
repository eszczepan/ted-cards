import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SourceTypeSwitcher } from "@/components/dashboard/SourceTypeSwitcher";
import { CharacterCounter } from "@/components/shared/CharacterCounter";
import { InlineAlert } from "@/components/shared/InlineAlert";
import { CreateGenerationCommand, SourceType, SOURCE_TYPE } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema
const formSchema = z
  .object({
    source_type: z.enum([SOURCE_TYPE.YOUTUBE, SOURCE_TYPE.TEXT]),
    source_youtube_url: z
      .string()
      .url("Please enter a valid YouTube URL")
      .optional()
      .refine((val) => val !== undefined && val !== "", {
        message: "YouTube URL is required",
        path: ["source_youtube_url"],
      }),
    source_text: z
      .string()
      .max(15000, "Text cannot exceed 15000 characters")
      .optional()
      .refine((val) => val !== undefined && val !== "", {
        message: "Source text is required",
        path: ["source_text"],
      }),
    front_language: z.string().min(1, "Front language is required"),
    back_language: z.string().min(1, "Back language is required"),
  })
  .superRefine((data, ctx) => {
    // Additional validation based on source type
    if (
      data.source_type === SOURCE_TYPE.YOUTUBE &&
      (!data.source_youtube_url || data.source_youtube_url.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "YouTube URL is required",
        path: ["source_youtube_url"],
      });
    }

    if (
      data.source_type === SOURCE_TYPE.TEXT &&
      (!data.source_text || data.source_text.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source text is required",
        path: ["source_text"],
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

type GenerationFormProps = {
  onSubmit: (data: CreateGenerationCommand) => void;
  isLoading: boolean;
};

export function GenerationForm({ onSubmit, isLoading }: GenerationFormProps) {
  // Available languages
  const languages = [
    { value: "en", label: "English" },
    { value: "pl", label: "Polish" },
  ];

  // Form configuration with react-hook-form and zod
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source_type: SOURCE_TYPE.YOUTUBE,
      front_language: "en",
      back_language: "pl",
    },
  });

  // Current form values
  const sourceType = watch("source_type");
  const sourceText = watch("source_text") || "";

  // Handle source type change
  const handleSourceTypeChange = (value: SourceType) => {
    setValue("source_type", value);
    // Clear the irrelevant field based on the selected type
    if (value === SOURCE_TYPE.YOUTUBE) {
      setValue("source_text", "");
    } else {
      setValue("source_youtube_url", "");
    }
  };

  // Form submission handler
  const onSubmitForm: SubmitHandler<FormValues> = (data) => {
    onSubmit(data as CreateGenerationCommand);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-6 w-full max-w-3xl"
    >
      <div className="space-y-4">
        <SourceTypeSwitcher
          value={sourceType}
          onChange={handleSourceTypeChange}
        />

        <AnimatePresence mode="wait">
          {sourceType === SOURCE_TYPE.YOUTUBE ? (
            <motion.div
              key="youtube-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <label
                htmlFor="youtube-url"
                className="block text-sm font-medium"
              >
                YouTube URL
              </label>
              <Controller
                name="source_youtube_url"
                control={control}
                render={({ field }) => (
                  <Input
                    id="youtube-url"
                    placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                    disabled={isLoading}
                    {...field}
                    value={field.value || ""}
                  />
                )}
              />
              {errors.source_youtube_url && (
                <InlineAlert
                  message={errors.source_youtube_url.message || ""}
                  variant="error"
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="text-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <label
                htmlFor="source-text"
                className="block text-sm font-medium"
              >
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
              <CharacterCounter
                currentLength={sourceText.length}
                maxLength={15000}
              />
              {errors.source_text && (
                <InlineAlert
                  message={errors.source_text.message || ""}
                  variant="error"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="front-language"
              className="block text-sm font-medium"
            >
              Front Card Language
            </label>
            <Controller
              name="front_language"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger id="front-language">
                    <SelectValue placeholder="Select front language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem
                        key={`front-${lang.value}`}
                        value={lang.value}
                      >
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.front_language && (
              <InlineAlert
                message={errors.front_language.message || ""}
                variant="error"
              />
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="back-language"
              className="block text-sm font-medium"
            >
              Back Card Language
            </label>
            <Controller
              name="back_language"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger id="back-language">
                    <SelectValue placeholder="Select back language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={`back-${lang.value}`} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.back_language && (
              <InlineAlert
                message={errors.back_language.message || ""}
                variant="error"
              />
            )}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Generating..." : "Generate Flashcards"}
      </Button>
    </form>
  );
}
