import { error, json, requireUser } from "@/lib/http";
import { createId, db, persist } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  return json({ templates: db().templates });
}

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  if (!body.name) return error("اسم القالب مطلوب");
  const template = { id: createId(), kind: body.kind || "message", name: body.name, content: body.content || "", createdAt: new Date().toISOString() };
  db().templates.unshift(template);
  persist();
  return json({ template });
}

export async function DELETE(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const { id } = await req.json();
  db().templates = db().templates.filter((t) => t.id !== id);
  persist();
  return json({ ok: true });
}
