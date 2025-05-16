"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/supabase/supabase.client";
import { User } from "@supabase/supabase-js";
import { AlertCircle, CheckCircle, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface UserProfileFormProps {
  user: User;
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const [email, setEmail] = useState<string>(user.email || "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isTestAccount = user.email?.endsWith("@test.com") || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setStatus("submitting");
      const supabase = createClient();

      const updates: { email?: string; password?: string } = {};

      // Only include fields that have been changed
      if (email !== user.email) {
        updates.email = email;
      }

      if (password) {
        // Dodatkowe zabezpieczenie, aby konta testowe nie mogły zmieniać haseł nawet przy ominięciu UI
        if (isTestAccount) {
          throw new Error("Test accounts cannot change passwords");
        }
        updates.password = password;
      }

      // Only make the API call if there are updates
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.updateUser(updates);

        if (error) {
          throw error;
        }

        setPassword("");
        setConfirmPassword("");
        setStatus("success");
      } else {
        setStatus("idle");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isTestAccount && (
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-5 w-5 text-blue-500" />
          <AlertDescription className="text-blue-700">
            This is a test account. Password changes are disabled for test users.
          </AlertDescription>
        </Alert>
      )}

      {status === "success" && (
        <div className="p-3 rounded-md bg-green-50 text-green-600 text-sm flex items-start gap-x-2">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <div>Your profile has been updated successfully</div>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start gap-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>{errorMessage || "An error occurred while updating your profile"}</div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          disabled={isTestAccount}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
          disabled={isTestAccount}
        />
        <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your new password"
          disabled={isTestAccount}
        />
      </div>

      <Button type="submit" disabled={status === "submitting" || isTestAccount} className="w-full">
        {status === "submitting" ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
