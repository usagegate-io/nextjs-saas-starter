"use client";

import { useActionState } from "react";

import { generate, type GenerateState } from "./actions";

export function GenerateForm() {
  const [state, action, pending] = useActionState<GenerateState, FormData>(generate, {});
  return (
    <>
      <form action={action} className="row">
        <input name="prompt" placeholder="What should we generate?" />
        <button type="submit" disabled={pending}>
          {pending ? "Generating…" : "Generate (1 credit)"}
        </button>
      </form>
      {state.result ? <p>{state.result}</p> : null}
      {state.remaining !== undefined ? <p className="muted">{state.remaining} credits left this month.</p> : null}
      {state.outOfCredits ? (
        <form action="/api/checkout" method="post">
          <p>You are out of credits on this plan.</p>
          <button type="submit">Upgrade to Pro</button>
        </form>
      ) : null}
      {state.error ? <p className="error">{state.error}</p> : null}
    </>
  );
}
