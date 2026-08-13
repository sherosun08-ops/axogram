import { json, requireUser } from "@/lib/http";
import { db, persist } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  return json({ notifications: db().notifications.slice(0, 40) });
}

export async function PATCH(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  if (body.all) db().notifications.forEach((n) => (n.read = true));
  else if (body.id) {
    const n = db().notifications.find((x) => x.id === body.id);
    if (n) n.read = true;
  }
  persist();
  return json({ ok: true });
}
