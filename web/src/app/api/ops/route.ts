import { error, json, requireUser } from "@/lib/http";
import { runOp } from "@/lib/engine";

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json().catch(() => ({}));
  try {
    const result = await runOp(String(body.action || ""), body.payload || {});
    return json(result);
  } catch (e) {
    return error((e as Error).message, 400);
  }
}
