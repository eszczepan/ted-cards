import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-8">
      <Separator className="mb-4" />
      <div className="container flex justify-center py-4">
        <p className="text-sm text-muted-foreground">&copy; {currentYear} Ted Cards. All rights reserved.</p>
      </div>
    </footer>
  );
}
