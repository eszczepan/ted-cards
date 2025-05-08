"use client";

import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/actions/auth.actions";
import { RegisterFormState, INITIAL_REGISTER_STATE } from "@/lib/schemas/auth.schemas";
import { useActionState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export function SignupForm() {
  const [formState, formAction, isPending] = useActionState<RegisterFormState, FormData>(
    register,
    INITIAL_REGISTER_STATE
  );

  return (
    <AuthFormWrapper
      title="Create an account"
      description="Enter your details below to create your account"
      footerContent={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
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
                  We&apos;ve sent a confirmation link to <strong>{formState.formValues.email}</strong>. Please check
                  your email to verify your account.
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password"
            className={formState.errors.password ? "border-red-500" : ""}
            defaultValue={formState.formValues?.password || ""}
            aria-describedby="password-error"
          />
          {formState.errors.password && (
            <p id="password-error" className="text-sm text-red-500">
              {formState.errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            className={formState.errors.confirmPassword ? "border-red-500" : ""}
            defaultValue={formState.formValues?.confirmPassword || ""}
            aria-describedby="confirmPassword-error"
          />
          {formState.errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-sm text-red-500">
              {formState.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-900 text-white hover:bg-gray-800"
          disabled={isPending || formState.status === "success"}
        >
          {isPending ? "Signing up..." : "Sign up"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
