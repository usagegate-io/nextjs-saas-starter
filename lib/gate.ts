import { GateClient } from "@usagegate/sdk";

let client: GateClient | null = null;

/** UsageGate: plans, usage limits and credits. Server-side only. */
export function gate(): GateClient {
  if (!client) {
    const key = process.env.USAGEGATE_KEY;
    if (!key) throw new Error("USAGEGATE_KEY is not set");
    client = new GateClient(key);
  }
  return client;
}

/** The metered feature this starter sells. Rename it to match Access rules. */
export const CREDITS = "ai_credits";
