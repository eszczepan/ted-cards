"use client";

import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/actions/auth.actions";
import { LoginFormState, INITIAL_LOGIN_STATE } from "@/lib/schemas/auth.schemas";
import { useActionState } from "react";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const [formState, formAction, isPending] = useActionState<LoginFormState, FormData>(login, INITIAL_LOGIN_STATE);

  return (
    <AuthFormWrapper
      title="Welcome back"
      description="Sign in to your account to continue"
      footerContent={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      }
    >
      <form className="space-y-6" action={formAction}>
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
            defaultValue={formState.formValues?.email || ""}
            aria-describedby="email-error"
          />
          {formState.errors.email && (
            <p id="email-error" className="text-sm text-red-500">
              {formState.errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/reset-password" className="text-sm font-medium text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
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

        <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
