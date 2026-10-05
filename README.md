# Next.js SaaS starter: Supabase, Stripe, and plans with usage limits

SaaS stack: Next.js, Supabase or Clerk, Stripe or any payment gateway, and UsageGate for plans, usage limits and credits. Don't build that part yourself.

A working SaaS you can deploy in ten minutes: users sign in, get a free plan with 10 AI credits a month, spend them, hit the limit, and upgrade with Stripe. Upgrades, downgrades and cancels apply on their own. There is no credits table, Redis counter or refill cron to write.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusagegate-io%2Fnextjs-saas-starter&project-name=my-saas&repository-name=my-saas&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,USAGEGATE_KEY,STRIPE_SECRET_KEY,STRIPE_PRICE_PRO&envDescription=Supabase%20URL%20and%20anon%20key%2C%20a%20UsageGate%20API%20key%2C%20and%20your%20Stripe%20secret%20key%20and%20Price%20id&envLink=https%3A%2F%2Fgithub.com%2Fusagegate-io%2Fnextjs-saas-starter%23setup)

| Layer | Use |
| --- | --- |
| App | Next.js 16 (App Router) |
| Auth | Supabase (magic link). Clerk works too: swap `lib/auth.ts` |
| Database | Supabase |
| Payments | Stripe (or Paddle, Paystack, Lemon Squeezy via `reportSubscription`) |
| Plans & limits | [UsageGate](https://www.usagegate.io): free plan, paid plans, usage limits and credits |

## What's in it

| File | Does |
| --- | --- |
| `app/login/page.tsx` | Email magic-link sign-in (Supabase) |
| `app/auth/callback/route.ts` | Starts the session and puts new users on Free with `grantPlan` |
| `app/dashboard/actions.ts` | The paid action: `consume` one credit, or show the upgrade button |
| `app/api/checkout/route.ts` | Stripe Checkout tagged with the user id |
| `app/api/generate/route.ts` | The same check as a JSON API (returns 402 when out of credits) |
| `lib/gate.ts` | One UsageGate client, server-side only |
| `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, `.claude/skills` | Tell Claude Code, Cursor and Codex how plans and limits work here |

## Setup

1. **Supabase.** Create a project at [supabase.com](https://supabase.com). Copy the project URL and anon key into `.env.local` (see `.env.example`). In Authentication → URL Configuration, add `http://localhost:3000/auth/callback` (and your production URL + `/auth/callback`) to the redirect URLs.
2. **UsageGate.** Create a free workspace at [usagegate.io](https://www.usagegate.io/signup) and an API key in Dashboard → API keys. Set `USAGEGATE_KEY`. Your workspace starts with `plan_free` (10 `ai_credits` a month) and paid plans you can edit in Access rules.
3. **Stripe.** Create a Product with a monthly Price. Set `STRIPE_SECRET_KEY` and `STRIPE_PRICE_PRO`, and paste the same Price id on your paid plan in UsageGate → Access rules. In UsageGate → Payment gateway, connect Stripe: add a webhook to `https://www.usagegate.io/api/webhooks/stripe` with `invoice.paid` and `customer.subscription.created` / `updated` / `deleted`, and paste its `whsec_` secret.
4. **Run it.**

   ```bash
   cp .env.example .env.local   # fill it in
   npm install
   npm run dev
   ```

   Sign in, press Generate until you run out, then Upgrade. Use Stripe's test card `4242 4242 4242 4242`.

Using another payment gateway? In UsageGate → Payment gateway choose Other, and call `gate().reportSubscription(...)` from that gateway's webhook instead of `/api/checkout`.

## Building with an AI agent

The rules are already in the repo (`AGENTS.md` for Codex and others, `CLAUDE.md` for Claude Code, `.cursor/rules` for Cursor, and the UsageGate skill in `.claude/skills`). Ask for "a Pro plan with PDF export" or "limit free users to 3 projects" and the agent will use UsageGate instead of building counters.

- Agent brief: https://www.usagegate.io/llms.txt
- How to build a SaaS (the whole stack): https://www.usagegate.io/stack
- SDK: https://www.usagegate.io/docs/sdk
