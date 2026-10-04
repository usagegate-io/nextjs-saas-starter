import type { ReactNode } from "react";

export const metadata = {
  title: "Next.js SaaS starter",
  description: "Next.js, any auth, Stripe or any gateway, and UsageGate for entitlements.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 40 }}>{children}</body>
    </html>
  );
}
