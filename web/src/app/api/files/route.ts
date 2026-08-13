import { error, json, requireUser } from "@/lib/http";
import { createId, db, persist } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  return json({ files: db().memberFiles });
}

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  const file = {
    id: createId(),
    name: body.name || "ملف جديد",
    source: body.source || "public_group",
    sourceRef: body.sourceRef || "",
    membersCount: Number(body.membersCount || 0),
    status: "ready",
    createdAt: new Date().toISOString(),
  };
  db().memberFiles.unshift(file);
  persist();
  return json({ file });
}

export async function DELETE(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const { ids } = await req.json();
  if (!ids?.length) return error("لا ملفات محددة");
  db().memberFiles = db().memberFiles.filter((f) => !ids.includes(f.id));
  persist();
  return json({ ok: true });
}
