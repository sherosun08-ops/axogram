import { error, json, requireUser } from "@/lib/http";
import { createId, db, persist } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  return json({ groups: db().groupDirectory });
}

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  if (!body.title) return error("اسم القروب مطلوب");
  const group = {
    id: createId(),
    title: body.title,
    username: body.username || null,
    inviteLink: body.inviteLink || null,
    members: Number(body.members || 0),
    type: body.type || "public",
    notes: body.notes || "",
    createdAt: new Date().toISOString(),
  };
  db().groupDirectory.unshift(group);
  persist();
  return json({ group });
}
