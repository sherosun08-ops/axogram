import { error, json, requireUser } from "@/lib/http";
import { db, persist } from "@/lib/store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const group = db().accountGroups.find((g) => g.id === params.id);
  if (!group) return error("المجموعة غير موجودة", 404);
  return json({ group: { ...group, accounts: db().accounts.filter((a) => a.groupId === group.id) } });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  const group = db().accountGroups.find((g) => g.id === params.id);
  if (!group) return error("المجموعة غير موجودة", 404);
  if (body.addIds) db().accounts.forEach((a) => { if (body.addIds.includes(a.id)) a.groupId = params.id; });
  if (body.removeIds) db().accounts.forEach((a) => { if (body.removeIds.includes(a.id)) a.groupId = null; });
  Object.assign(group, { name: body.name ?? group.name, description: body.description ?? group.description, purpose: body.purpose ?? group.purpose });
  persist();
  return json({ group: { ...group, accounts: db().accounts.filter((a) => a.groupId === group.id) } });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  db().accounts.forEach((a) => { if (a.groupId === params.id) a.groupId = null; });
  db().accountGroups = db().accountGroups.filter((g) => g.id !== params.id);
  persist();
  return json({ ok: true });
}
