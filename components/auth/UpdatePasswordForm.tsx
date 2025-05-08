import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UpdatePasswordForm() {
  return (
    <AuthFormWrapper
      title="Set a new password"
      description="Enter your new password below."
      footerContent={
        <p>
          Password updated?{}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your new password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your new password"
          />
        </div>

        <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800">
          Set new password
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
