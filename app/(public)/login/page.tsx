import { LoginForm } from "@/components/shared/LoginForm";
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
