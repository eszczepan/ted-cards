import { ResetPasswordRequestForm } from "@/components/auth/ResetPasswordForm";
import { AuthPageLayout } from "@/components/layout/AuthPageLayout";
import React from "react";

export default function ResetPasswordPage() {
  return (
    <AuthPageLayout>
      <ResetPasswordRequestForm />
    </AuthPageLayout>
  );
}
