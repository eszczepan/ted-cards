import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { AuthPageLayout } from "@/components/layout/AuthPageLayout";
import React, { Suspense } from "react";

export default function UpdatePasswordPage() {
  return (
    <AuthPageLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <UpdatePasswordForm />
      </Suspense>
    </AuthPageLayout>
  );
}
