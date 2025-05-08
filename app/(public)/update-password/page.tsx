import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { AuthPageLayout } from "@/components/layout/AuthPageLayout";
import React from "react";

export default function UpdatePasswordPage() {
  return (
    <AuthPageLayout>
      <UpdatePasswordForm />
    </AuthPageLayout>
  );
}
