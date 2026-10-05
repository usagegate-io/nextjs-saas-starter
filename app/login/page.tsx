import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { supabaseServer } from "../../lib/supabase/server";

async function sendLink(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/login?error=email");

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  redirect(error ? "/login?error=send" : "/login?sent=1");
}

export default async function Login({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const { sent, error } = await searchParams;
  return (
    <main>
      <h1>Sign in</h1>
      {sent ? (
        <p>Check your email for a sign-in link.</p>
      ) : (
        <form action={sendLink} className="row">
          <input name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
          <button type="submit">Email me a link</button>
        </form>
      )}
      {error ? <p className="error">Could not send the link. Check the address and try again.</p> : null}
    </main>
  );
}
