import { NextResponse } from "next/server";

import { gate } from "../../../lib/gate";
import { supabaseServer } from "../../../lib/supabase/server";

/** The magic link lands here: start the session, then make sure the user has a plan. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/login?error=link", url));

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return NextResponse.redirect(new URL("/login?error=link", url));

  // New users start on Free. Safe on every login: a user already on a plan,
  // free or paid, keeps it (no refill, no downgrade).
  await gate().grantPlan(data.user.id, "plan_free");

  return NextResponse.redirect(new URL("/dashboard", url));
}
