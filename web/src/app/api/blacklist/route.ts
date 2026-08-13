import { error, json, requireUser } from "@/lib/http";
import { createId, db, persist } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  return json({ items: db().blacklist });
}

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  if (!body.value) return error("القيمة مطلوبة");
  const item = { id: createId(), value: body.value, kind: body.kind || "user", reason: body.reason || "", scope: body.scope || "global", createdAt: new Date().toISOString() };
  db().blacklist.unshift(item);
  persist();
  return json({ item });
}

export async function DELETE(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const { id, all } = await req.json();
  if (all) db().blacklist = [];
  else if (id) db().blacklist = db().blacklist.filter((b) => b.id !== id);
  persist();
  return json({ ok: true });
}
