import { ResetPasswordRequestForm } from "@/components/auth/ResetPasswordRequestForm";
import { AuthPageLayout } from "@/components/layout/AuthPageLayout";
import React from "react";

export default function ResetPasswordPage() {
  return (
    <AuthPageLayout>
      <ResetPasswordRequestForm />
    </AuthPageLayout>
  );
}
