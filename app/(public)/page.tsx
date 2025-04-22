import { createClient } from "@/supabase/supabase.server";

export default async function Home() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <div className="grid items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main>
        <h1 className="text-4xl font-bold">
          Ted Cards - AI-powered flashcards
        </h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </main>
      <footer>Ted Cards - 2025</footer>
    </div>
  );
}
