import { SignupForm } from "@/components/shared/SignupForm";
import React from "react";

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <SignupForm />
    </div>
  );
}
