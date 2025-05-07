import { ResetPasswordRequestForm } from "@/components/shared/ResetPasswordRequestForm";
import React from "react";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <ResetPasswordRequestForm />
    </div>
  );
}
