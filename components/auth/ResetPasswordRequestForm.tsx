"use client";

import React from "react";
import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordRequestForm() {
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
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="Enter your email" />
        </div>

        <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800">
          Send password reset link
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
