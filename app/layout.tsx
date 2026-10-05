import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
  title: "Next.js SaaS starter",
  description: "Next.js, Supabase, Stripe, and UsageGate for plans, usage limits and credits.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
