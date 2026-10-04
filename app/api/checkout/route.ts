import Stripe from "stripe";

import { getUserId } from "../../../lib/auth";

/**
 * Stripe Checkout for the paid plan. UsageGate reads end_user_id from the
 * subscription and the Price id to pick the plan, so both must be set.
 */
export async function POST(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_PRO!, quantity: 1 }],
    success_url: `${process.env.APP_URL}/?upgraded=1`,
    cancel_url: `${process.env.APP_URL}/?canceled=1`,
    subscription_data: { metadata: { end_user_id: userId } },
  });

  return Response.json({ url: session.url });
}
