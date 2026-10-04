/**
 * Replace with your auth provider. The id you return here is the one UsageGate
 * tracks, and the one Stripe Checkout must carry in end_user_id.
 *
 * Clerk:
 *   import { auth } from "@clerk/nextjs/server";
 *   const { userId } = await auth();
 *
 * Supabase:
 *   const { data } = await supabase.auth.getUser();
 *   const userId = data.user?.id ?? null;
 */
export async function getUserId(req: Request): Promise<string | null> {
  return req.headers.get("x-user-id");
}
