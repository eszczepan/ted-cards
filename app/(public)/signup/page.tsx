import { SignupForm } from "@/components/auth/SignupForm";
import { AuthPageLayout } from "@/components/layout/AuthPageLayout";

export default function SignupPage() {
  return (
    <AuthPageLayout>
      <SignupForm />
    </AuthPageLayout>
  );
}
