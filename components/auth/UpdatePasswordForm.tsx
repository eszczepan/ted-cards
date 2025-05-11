"use client";

import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/lib/actions/auth.actions";
import { UpdatePasswordFormState, INITIAL_UPDATE_PASSWORD_STATE } from "@/lib/schemas/auth.schemas";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle } from "lucide-react";

export function UpdatePasswordForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const [formState, formAction, isPending] = useActionState<UpdatePasswordFormState, FormData>(
    updatePassword,
    INITIAL_UPDATE_PASSWORD_STATE
  );

  return (
    <AuthFormWrapper
      title="Set a new password"
      description="Enter your new password below."
      footerContent={
        <p>
          Password updated?{" "}
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
            <div>{formState.message}</div>
          </div>
        )}

        {formState.errors._form && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start gap-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>{formState.errors._form[0]}</div>
          </div>
        )}

        <input type="hidden" name="code" value={code} />

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your new password"
            className={formState.errors.newPassword ? "border-red-500" : ""}
            defaultValue={formState.status === "success" ? "" : formState.formValues?.newPassword || ""}
            aria-describedby="newPassword-error"
          />
          {formState.errors.newPassword && (
            <p id="newPassword-error" className="text-sm text-red-500">
              {formState.errors.newPassword[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your new password"
            className={formState.errors.confirmNewPassword ? "border-red-500" : ""}
            defaultValue={formState.status === "success" ? "" : formState.formValues?.confirmNewPassword || ""}
            aria-describedby="confirmNewPassword-error"
          />
          {formState.errors.confirmNewPassword && (
            <p id="confirmNewPassword-error" className="text-sm text-red-500">
              {formState.errors.confirmNewPassword[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-900 text-white hover:bg-gray-800"
          disabled={isPending || formState.status === "success"}
        >
          {isPending ? "Updating..." : "Set new password"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
