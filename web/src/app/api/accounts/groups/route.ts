import { error, json, requireUser } from "@/lib/http";
import { createId, db, persist } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  const data = db();
  const groups = data.accountGroups.map((g) => ({ ...g, accounts: data.accounts.filter((a) => a.groupId === g.id) }));
  return json({ groups });
}

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return error("اسم المجموعة مطلوب");
  if (db().accountGroups.some((g) => g.name === name)) return error("هذا الاسم مستخدم — اختر اسماً آخر");
  const group = { id: createId(), name, description: body.description || "", purpose: body.purpose || "multi", createdAt: new Date().toISOString() };
  db().accountGroups.unshift(group);
  persist();
  return json({ group });
}
