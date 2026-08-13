import { error, json, requireUser } from "@/lib/http";
import { db, persist, withAccount } from "@/lib/store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const acc = db().accounts.find((a) => a.id === params.id);
  if (!acc) return error("الحساب غير موجود", 404);
  return json({ account: withAccount(acc) });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json().catch(() => ({}));
  const acc = db().accounts.find((a) => a.id === params.id);
  if (!acc) return error("الحساب غير موجود", 404);
  Object.assign(acc, body);
  persist();
  return json({ account: acc });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const data = db();
  data.accounts = data.accounts.filter((a) => a.id !== params.id);
  persist();
  return json({ ok: true });
}
