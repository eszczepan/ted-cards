import { LoginForm } from "@/components/auth/LoginForm";
import { AuthPageLayout } from "@/components/layout/AuthPageLayout";
import React from "react";

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <LoginForm />
    </AuthPageLayout>
  );
}
