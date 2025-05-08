import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type AuthFormWrapperProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footerContent: React.ReactNode;
};

export function AuthFormWrapper({ title, description, children, footerContent }: AuthFormWrapperProps) {
  return (
    <Card className="w-full max-w-md shadow-md sm:py-12">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight md:text-3xl">{title}</CardTitle>
        <CardDescription className="pt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-4">{children}</CardContent>
      <CardFooter className="flex flex-col items-center justify-center px-6 text-sm text-muted-foreground">
        {footerContent}
      </CardFooter>
    </Card>
  );
}
