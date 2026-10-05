import { currentUser } from "../../../lib/auth";
import { CREDITS, gate } from "../../../lib/gate";

/** The same check as the dashboard button, as a JSON API (for an API product or a mobile app). */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const spent = await gate().consume(user.id, CREDITS, 1);
  if (!spent.success) {
    return Response.json({ error: "out of credits", upgradeUrl: "/dashboard" }, { status: 402 });
  }

  const { prompt } = (await req.json().catch(() => ({}))) as { prompt?: string };
  return Response.json({ result: `Generated for: ${prompt ?? ""}`, remaining: spent.remaining });
}
