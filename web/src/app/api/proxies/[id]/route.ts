import { error, json, requireUser } from "@/lib/http";
import { db, persist, withProxy } from "@/lib/store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const proxy = db().proxies.find((p) => p.id === params.id);
  if (!proxy) return error("البروكسي غير موجود", 404);
  return json({ proxy: withProxy(proxy) });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  const proxy = db().proxies.find((p) => p.id === params.id);
  if (!proxy) return error("البروكسي غير موجود", 404);
  Object.assign(proxy, body);
  persist();
  return json({ proxy });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  db().accounts.forEach((a) => { if (a.proxyId === params.id) a.proxyId = null; });
  db().proxies = db().proxies.filter((p) => p.id !== params.id);
  persist();
  return json({ ok: true });
}
