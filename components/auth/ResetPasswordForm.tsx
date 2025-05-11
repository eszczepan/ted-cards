"use client";

import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/actions/auth.actions";
import { ResetPasswordFormState, INITIAL_RESET_PASSWORD_STATE } from "@/lib/schemas/auth.schemas";
import { useActionState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export function ResetPasswordRequestForm() {
  const [formState, formAction, isPending] = useActionState<ResetPasswordFormState, FormData>(
    resetPassword,
    INITIAL_RESET_PASSWORD_STATE
  );

  return (
    <AuthFormWrapper
      title="Forgot your password?"
      description="Enter your email address and we'll send you a link to reset your password."
      footerContent={
        <p>
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-6" action={formAction}>
        {formState.status === "success" && (
          <div className="p-3 rounded-md bg-green-50 text-green-600 text-sm flex items-start gap-x-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              {formState.message}
              {formState.formValues?.email && (
                <span className="font-medium">
                  {" "}
                  We&apos;ve sent a reset link to {formState.formValues.email} if an account exists for that address.
                </span>
              )}
            </div>
          </div>
        )}

        {formState.errors._form && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start gap-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>{formState.errors._form[0]}</div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className={formState.errors.email ? "border-red-500" : ""}
            defaultValue={formState.status === "success" ? "" : formState.formValues?.email || ""}
            aria-describedby="email-error"
          />
          {formState.errors.email && (
            <p id="email-error" className="text-sm text-red-500">
              {formState.errors.email[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-900 text-white hover:bg-gray-800"
          disabled={isPending || formState.status === "success"}
        >
          {isPending ? "Sending..." : "Send password reset link"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
