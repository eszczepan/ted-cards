"use client";

import React from "react";
import Link from "next/link";
import { AuthFormWrapper } from "@/components/shared/AuthFormWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  return (
    <AuthFormWrapper
      title="Create an account"
      description="Enter your details below to create your account"
      footerContent={
        <p>
          Already have an account?{}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="Enter your email" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
          />
        </div>

        <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800">
          Sign up
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
