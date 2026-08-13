import { json, requireUser } from "@/lib/http";
import { db } from "@/lib/store";

export async function GET(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const level = url.searchParams.get("level");
  const logs = db()
    .activityLogs.filter((l) => (!type || l.type === type) && (!level || l.level === level))
    .slice(0, 200)
    .map((l) => ({ ...l, account: db().accounts.find((a) => a.id === l.accountId) || null }));
  return json({ logs });
}
