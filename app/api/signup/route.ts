import { getUserId } from "../../../lib/auth";
import { gate } from "../../../lib/gate";

/** Call once after your auth provider creates the user. */
export async function POST(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  // Free plan with a monthly refill. Paid plans come from Stripe, not from here.
  await gate().grantPlan(userId, "plan_free");

  return Response.json({ ok: true });
}
