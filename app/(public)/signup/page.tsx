import { signup } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-4 w-full max-w-md p-4 border border-gray-300 rounded-md">
      <Label htmlFor="email">Email:</Label>
      <Input id="email" name="email" type="email" required className="border border-gray-300 rounded-md p-2" />
      <Label htmlFor="password">Password:</Label>
      <Input id="password" name="password" type="password" required className="border border-gray-300 rounded-md p-2" />
      <Button formAction={signup}>Sign up</Button>
    </form>
  );
}
