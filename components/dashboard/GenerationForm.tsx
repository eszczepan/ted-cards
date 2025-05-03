import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SourceTypeSwitcher } from "@/components/dashboard/SourceTypeSwitcher";
import { InlineAlert } from "@/components/shared/InlineAlert";
import { CreateGenerationCommand, SourceType, SOURCE_TYPE } from "@/types";
import { AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { YouTubeForm } from "./YouTubeForm";
import { TextForm } from "./TextForm";

export type GenerationFormBase = {
  source_type: SourceType;
  front_language: string;
  back_language: string;
  source_youtube_url: string;
  source_text: string;
};

export type YouTubeFormType = {
  source_type: typeof SOURCE_TYPE.YOUTUBE;
  front_language: string;
  back_language: string;
  source_youtube_url: string;
  source_text?: string;
};

export type TextFormType = {
  source_type: typeof SOURCE_TYPE.TEXT;
  front_language: string;
  back_language: string;
  source_text: string;
  source_youtube_url?: string;
};

export type FormValues = YouTubeFormType | TextFormType;

const youtubeUrlSchema = z.string().url("Please enter a valid YouTube URL").min(1, "YouTube URL is required");

const sourceTextSchema = z.string().min(1, "Source text is required").max(15000, "Text cannot exceed 15000 characters");

const commonFieldsSchema = z.object({
  source_type: z.enum([SOURCE_TYPE.YOUTUBE, SOURCE_TYPE.TEXT]),
  front_language: z.string().min(1, "Front language is required"),
  back_language: z.string().min(1, "Back language is required"),
});

const youtubeSchema = commonFieldsSchema.extend({
  source_type: z.literal(SOURCE_TYPE.YOUTUBE),
  source_youtube_url: youtubeUrlSchema,
  source_text: z.string().optional(),
});

const textSchema = commonFieldsSchema.extend({
  source_type: z.literal(SOURCE_TYPE.TEXT),
  source_text: sourceTextSchema,
  source_youtube_url: z.string().optional(),
});

const formSchema = z.discriminatedUnion("source_type", [youtubeSchema, textSchema]);

type GenerationFormProps = {
  onSubmit: (data: CreateGenerationCommand) => void;
  isLoading: boolean;
};

export function GenerationForm({ onSubmit, isLoading }: GenerationFormProps) {
  const languages = [
    { value: "en", label: "English" },
    { value: "pl", label: "Polish" },
  ];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<GenerationFormBase>({
    resolver: zodResolver(formSchema) as unknown as never,
    defaultValues: {
      source_type: SOURCE_TYPE.YOUTUBE,
      front_language: "en",
      back_language: "pl",
      source_youtube_url: "",
      source_text: "",
    },
  });

  const sourceType = watch("source_type");
  const sourceText = watch("source_text") || "";

  const handleSourceTypeChange = (value: SourceType) => {
    setValue("source_type", value);
  };

  const onSubmitForm = (data: GenerationFormBase) => {
    onSubmit(data as CreateGenerationCommand);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 w-full max-w-3xl">
      <div className="space-y-4">
        <SourceTypeSwitcher value={sourceType} onChange={handleSourceTypeChange} />

        <AnimatePresence mode="wait">
          {sourceType === SOURCE_TYPE.YOUTUBE && (
            <YouTubeForm control={control} errors={errors} isLoading={isLoading} />
          )}
          {sourceType === SOURCE_TYPE.TEXT && (
            <TextForm control={control} errors={errors} isLoading={isLoading} sourceText={sourceText} />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="front-language" className="block text-sm font-medium">
              Front Card Language
            </label>
            <Controller
              name="front_language"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                  <SelectTrigger id="front-language">
                    <SelectValue placeholder="Select front language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={`front-${lang.value}`} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.front_language && (
              <InlineAlert message={String(errors.front_language.message || "")} variant="error" />
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="back-language" className="block text-sm font-medium">
              Back Card Language
            </label>
            <Controller
              name="back_language"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
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
              <InlineAlert message={String(errors.back_language.message || "")} variant="error" />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button type="submit" disabled={isLoading} className="w-full max-w-xs" size="lg">
          {isLoading ? "Generating..." : "Generate Flashcards"}
        </Button>
      </div>
    </form>
  );
}
