import { SignupForm } from "@/components/auth/SignupForm";
import { AuthPageLayout } from "@/components/layout/AuthPageLayout";
import React from "react";

export default function SignupPage() {
  return (
    <AuthPageLayout>
      <SignupForm />
    </AuthPageLayout>
  );
}
