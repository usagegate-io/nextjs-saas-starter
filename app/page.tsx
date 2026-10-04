export default function Home() {
  return (
    <main>
      <h1>Next.js SaaS starter</h1>
      <p>Routes:</p>
      <ul>
        <li>
          <code>POST /api/signup</code>: assigns the Free plan.
        </li>
        <li>
          <code>POST /api/generate</code>: checks the plan, returns 402 when the user is out of
          credits, spends one after the work.
        </li>
        <li>
          <code>POST /api/checkout</code>: Stripe Checkout tagged with the user id.
        </li>
      </ul>
      <p>
        Send <code>x-user-id</code> as a header until you plug in real auth in{" "}
        <code>lib/auth.ts</code>.
      </p>
    </main>
  );
}
