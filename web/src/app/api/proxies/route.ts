import { error, json, requireUser } from "@/lib/http";
import { createId, db, persist, withProxy } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  const data = db();
  return json({
    proxies: data.proxies.map((p) => withProxy(p, data)),
    groups: data.proxyGroups.map((g) => ({ ...g, proxies: data.proxies.filter((p) => p.groupId === g.id) })),
  });
}

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  const host = String(body.host || "").trim();
  const port = Number(body.port);
  if (!host || !port) return error("العنوان والمنفذ مطلوبان");
  const proxy = {
    id: createId(),
    host,
    port,
    type: body.type || "socks5",
    username: body.username || null,
    password: body.password || null,
    secret: body.secret || null,
    country: body.country || null,
    status: "unknown",
    failCount: 0,
    groupId: body.groupId || null,
    createdAt: new Date().toISOString(),
  };
  db().proxies.unshift(proxy);
  persist();
  return json({ proxy });
}

export async function DELETE(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const { ids } = await req.json();
  db().proxies = db().proxies.filter((p) => !(ids || []).includes(p.id));
  persist();
  return json({ ok: true });
}
