"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CEFR_LEVEL } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLanguage } from "@/lib/utils";

const formSchema = z.object({
  front_content: z.string().min(1, "Front content is required").max(200, "Front content cannot exceed 200 characters"),
  back_content: z.string().min(1, "Back content is required").max(500, "Back content cannot exceed 500 characters"),
  front_language: z.string().min(2, "Front language is required"),
  back_language: z.string().min(2, "Back language is required"),
  cefr_level: z.enum([CEFR_LEVEL.A1, CEFR_LEVEL.A2, CEFR_LEVEL.B1, CEFR_LEVEL.B2, CEFR_LEVEL.C1, CEFR_LEVEL.C2]),
});

export type CreateFlashcardFormData = z.infer<typeof formSchema>;

interface FlashcardCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateFlashcardFormData) => Promise<void>;
}

export default function FlashcardCreateModal({ isOpen, onClose, onCreate }: FlashcardCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languages = [
    { value: "en", label: "English" },
    { value: "pl", label: "Polish" },
  ];

  const form = useForm<CreateFlashcardFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      front_content: "",
      back_content: "",
      front_language: "English",
      back_language: "English",
      cefr_level: CEFR_LEVEL.B1,
    },
  });

  const onSubmit = async (data: CreateFlashcardFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onCreate(data);
      form.reset();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create flashcard");
      console.error("Error creating flashcard:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Flashcard</DialogTitle>
          <DialogDescription>Fill out the form to create a new flashcard.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="front_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Front Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Front content of the flashcard" {...field} className="resize-none h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="back_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Back Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Back content of the flashcard" {...field} className="resize-none h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="front_language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Front Language</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(getLanguage(value))}
                      value={
                        field.value === "English" ? "en" : field.value === "Polish" ? "pl" : field.value.toLowerCase()
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={`front-${lang.value}`} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="back_language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Back Language</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(getLanguage(value))}
                      value={
                        field.value === "English" ? "en" : field.value === "Polish" ? "pl" : field.value.toLowerCase()
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={`back-${lang.value}`} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cefr_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEFR Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a CEFR level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CEFR_LEVEL).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-sm font-medium text-destructive">{error}</div>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Flashcard"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
