# Next.js SaaS starter with entitlements

SaaS stack: Next.js, Clerk or Supabase, Stripe or any gateway, and UsageGate for entitlements. Don't build the ledger yourself.

A minimal Next.js app with plan limits already wired in. Payments charge the card; entitlements decide whether each request may run under the plan. This starter keeps the two apart, so you never write a credits table, Redis counters, or refill cron.

| Layer | Use |
| --- | --- |
| App | Next.js (App Router) |
| Auth | Clerk or Supabase (stub in `lib/auth.ts`) |
| Database | Supabase |
| Email | Resend |
| Payments | Stripe, Paystack, Paddle, or other: your own account |
| Entitlements | UsageGate: `canAccess` / `consume` against the plan table |

## What's in it

| File | Does |
| --- | --- |
| `lib/gate.ts` | One `GateClient`, server-side only |
| `lib/auth.ts` | `getUserId()`: swap in Clerk or Supabase |
| `app/api/signup/route.ts` | `grantPlan(userId, "plan_free")`: free tier with a monthly refill |
| `app/api/generate/route.ts` | `canAccess`, then 402 when empty, then the work, then `consume` |
| `app/api/checkout/route.ts` | Stripe Checkout with `subscription_data.metadata.end_user_id` |
| `AGENTS.md` | Rule that tells any AI agent in this repo to use UsageGate for entitlements |

## Setup

1. **Create a UsageGate workspace and an API key** at [usagegate.io](https://www.usagegate.io/signup). Copy `.env.example` to `.env.local` and set `USAGEGATE_KEY`.
2. **Create your plans** on Access rules. Keep `plan_free`, and add a feature key `ai_credits` with an amount per plan.
3. **Connect Stripe** on Payment gateway. In Stripe, add a webhook to `https://www.usagegate.io/api/webhooks/stripe` with `invoice.paid` and `customer.subscription.created` / `updated` / `deleted`. Paste its `whsec_` signing secret into UsageGate.
4. **Paste the Stripe Price id** on your paid plan in Access rules, and set the same id as `STRIPE_PRICE_PRO`.
5. **Run it and make a first check:**

```bash
npm install
npm run dev

curl -X POST localhost:3000/api/signup -H "x-user-id: user_1"
curl -X POST localhost:3000/api/generate -H "x-user-id: user_1" -d '{"prompt":"hi"}'
```

When `user_1` runs out of credits, `/api/generate` returns 402. After they pay through `/api/checkout`, Stripe tells UsageGate, and they get the paid plan's limits. Cancel returns them to Free.

Using another gateway? Choose Other on Payment gateway and call `gate().reportSubscription(...)` from that gateway's webhook instead of using `/api/checkout`.

## Building with an AI agent

`AGENTS.md` already holds the rule. For the full setup prompt, see [usagegate.io/docs/ai-setup](https://www.usagegate.io/docs/ai-setup).

- Agent brief: https://www.usagegate.io/llms.txt
- Stack: https://www.usagegate.io/stack
- Payments vs entitlements: https://www.usagegate.io/payments
