"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <Button variant="ghost" size="sm" className="mb-6 -ml-2" onClick={handleBack}>
      <span className="flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </span>
    </Button>
  );
}
