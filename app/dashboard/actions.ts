"use server";

import { currentUser } from "../../lib/auth";
import { CREDITS, gate } from "../../lib/gate";

export type GenerateState = {
  result?: string;
  remaining?: number;
  outOfCredits?: boolean;
  error?: string;
};

/**
 * The expensive action. consume() is the check: it spends one credit atomically,
 * so two clicks at once can never both use the last credit.
 */
export async function generate(_prev: GenerateState, formData: FormData): Promise<GenerateState> {
  const user = await currentUser();
  if (!user) return { error: "Sign in again." };

  const spent = await gate().consume(user.id, CREDITS, 1);
  if (!spent.success) {
    // spent.error is set when the setup is wrong (bad key, unknown feature key).
    return spent.error ? { error: spent.error } : { outOfCredits: true, remaining: 0 };
  }

  const prompt = String(formData.get("prompt") ?? "");
  // Replace with your real work: an LLM call, an image, an export...
  const result = `Generated something for “${prompt || "nothing"}”.`;

  return { result, remaining: spent.remaining };
}
