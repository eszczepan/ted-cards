import { signup } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-4 w-full max-w-md p-4 border border-gray-300 rounded-md">
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        className="border border-gray-300 rounded-md p-2"
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        className="border border-gray-300 rounded-md p-2"
      />
      <button formAction={signup}>Sign up</button>
    </form>
  );
}
