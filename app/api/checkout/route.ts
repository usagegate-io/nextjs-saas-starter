import { NextResponse } from "next/server";
import Stripe from "stripe";

import { currentUser } from "../../../lib/auth";

/**
 * Stripe Checkout for the paid plan. UsageGate reads end_user_id from the
 * subscription and the Price id to pick the plan, so both must be set.
 */
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url), { status: 303 });

  const origin = new URL(request.url).origin;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_PRO!, quantity: 1 }],
    customer_email: user.email,
    success_url: `${origin}/dashboard?upgraded=1`,
    cancel_url: `${origin}/dashboard`,
    subscription_data: { metadata: { end_user_id: user.id } },
  });

  return NextResponse.redirect(session.url!, { status: 303 });
}
