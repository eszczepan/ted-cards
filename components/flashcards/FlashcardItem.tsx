"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlashcardDTO } from "@/types";

interface FlashcardItemProps {
  flashcard: FlashcardDTO;
  onEdit: () => void;
  onDelete: () => void;
}

export default function FlashcardItem({ flashcard, onEdit, onDelete }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCefrBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: "bg-green-100 text-green-800",
      A2: "bg-green-200 text-green-800",
      B1: "bg-blue-100 text-blue-800",
      B2: "bg-blue-200 text-blue-800",
      C1: "bg-purple-100 text-purple-800",
      C2: "bg-purple-200 text-purple-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="relative h-[300px] w-full">
      <motion.div
        className="w-full h-full cursor-pointer preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <Card className="absolute inset-0 w-full h-full backface-hidden" style={{ backfaceVisibility: "hidden" }}>
          <CardHeader className="pb-2 flex flex-row justify-between items-start">
            <div>
              <Badge className={getCefrBadgeColor(flashcard.cefr_level)}>{flashcard.cefr_level}</Badge>
              <Badge variant="outline" className="ml-2">
                {flashcard.front_language} → {flashcard.back_language}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">{formatDate(flashcard.created_at)}</div>
          </CardHeader>
          <CardContent className="text-center flex items-center justify-center flex-grow py-8">
            <h3 className="text-xl font-medium">{flashcard.front_content}</h3>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>

        {/* Back of Card */}
        <Card
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardHeader className="pb-2 flex flex-row justify-between items-start">
            <div>
              <Badge className={getCefrBadgeColor(flashcard.cefr_level)}>{flashcard.cefr_level}</Badge>
              <Badge variant="outline" className="ml-2">
                {flashcard.front_language} → {flashcard.back_language}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">{formatDate(flashcard.created_at)}</div>
          </CardHeader>
          <CardContent className="text-center flex items-center justify-center flex-grow py-8">
            <p>{flashcard.back_content}</p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
