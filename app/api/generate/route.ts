import { getUserId } from "../../../lib/auth";
import { gate } from "../../../lib/gate";

const FEATURE = "ai_credits";

/** The expensive route: check the plan before the work, spend after it. */
export async function POST(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  if (!(await gate().canAccess(userId, FEATURE))) {
    return Response.json({ error: "upgrade", upgradeUrl: "/pricing" }, { status: 402 });
  }

  const { prompt } = (await req.json()) as { prompt?: string };
  const result = `Generated for: ${prompt ?? ""}`;

  await gate().consume(userId, FEATURE, 1);

  return Response.json({ result });
}
