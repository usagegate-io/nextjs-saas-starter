import { redirect } from "next/navigation";

import { currentUser } from "../../lib/auth";
import { GenerateForm } from "./generate-form";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const { upgraded } = await searchParams;

  return (
    <main>
      <h1>Dashboard</h1>
      <p className="muted">Signed in as {user.email}</p>
      {upgraded ? <p>Thanks! Your new limits apply as soon as Stripe confirms the payment.</p> : null}

      <div className="card">
        <GenerateForm />
      </div>

      <div className="card">
        <form action="/api/checkout" method="post" className="row">
          <button type="submit">Upgrade to Pro</button>
        </form>
        <form action="/auth/signout" method="post" style={{ marginTop: 12 }}>
          <button type="submit" className="secondary">Sign out</button>
        </form>
      </div>
    </main>
  );
}
