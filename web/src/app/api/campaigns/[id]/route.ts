import { error, json, requireUser } from "@/lib/http";
import { db, persist } from "@/lib/store";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  const campaign = db().campaigns.find((c) => c.id === params.id);
  if (!campaign) return error("غير موجودة", 404);
  Object.assign(campaign, body);
  persist();
  return json({ campaign });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  db().campaigns = db().campaigns.filter((c) => c.id !== params.id);
  persist();
  return json({ ok: true });
}
