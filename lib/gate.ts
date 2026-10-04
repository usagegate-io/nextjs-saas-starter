import { GateClient } from "@usagegate/sdk";

let client: GateClient | null = null;

/** Server-side only. Never import this from a client component. */
export function gate(): GateClient {
  if (!client) {
    const key = process.env.USAGEGATE_KEY;
    if (!key) throw new Error("USAGEGATE_KEY is not set");
    client = new GateClient(key, { baseUrl: process.env.USAGEGATE_API_BASE_URL });
  }
  return client;
}
