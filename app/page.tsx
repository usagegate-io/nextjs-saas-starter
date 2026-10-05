import Link from "next/link";

import { currentUser } from "../lib/auth";

export default async function Home() {
  const user = await currentUser();
  return (
    <main>
      <h1>Your SaaS</h1>
      <p>
        A free plan with 10 AI credits a month, a paid plan with more. Sign in, spend credits, hit the
        limit, upgrade with Stripe.
      </p>
      <p>
        <Link href={user ? "/dashboard" : "/login"}>{user ? "Open the dashboard →" : "Sign in →"}</Link>
      </p>
      <p className="muted">
        Built with Next.js, Supabase, Stripe, and{" "}
        <a href="https://www.usagegate.io">UsageGate</a> for plans, usage limits and credits.
      </p>
    </main>
  );
}
