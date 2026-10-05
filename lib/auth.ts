import type { User } from "@supabase/supabase-js";

import { supabaseServer } from "./supabase/server";

/**
 * The signed-in user, or null. Its id is the one UsageGate tracks and the one
 * Stripe Checkout carries in end_user_id. Using Clerk instead? Return
 * `(await auth()).userId` from "@clerk/nextjs/server" and keep the rest.
 */
export async function currentUser(): Promise<User | null> {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
