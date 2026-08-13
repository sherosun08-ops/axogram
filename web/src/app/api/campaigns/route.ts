import { error, json, requireUser } from "@/lib/http";
import { createId, db, persist } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  return json({ campaigns: db().campaigns });
}

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  if (!body.name || !body.message) return error("الاسم والرسالة مطلوبان");
  const campaign = {
    id: createId(),
    kind: body.kind || "dm",
    name: body.name,
    message: body.message,
    status: body.status || "draft",
    targetsCount: Number(body.targetsCount || 0),
    sentCount: 0,
    failCount: 0,
    createdAt: new Date().toISOString(),
  };
  db().campaigns.unshift(campaign);
  persist();
  return json({ campaign });
}
