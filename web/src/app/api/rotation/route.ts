import { json, requireUser } from "@/lib/http";
import { db, persist } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  const data = db();
  const settings = data.rotationSettings[0] || null;
  const slots = data.rotationSlots.map((s) => ({ ...s, account: data.accounts.find((a) => a.id === s.accountId) })).filter((s) => s.account);
  return json({ settings, slots, accounts: data.accounts });
}

export async function PATCH(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  const data = db();
  if (!data.rotationSettings[0]) data.rotationSettings.push({ id: "default", ...body });
  else Object.assign(data.rotationSettings[0], body);
  persist();
  return json({ settings: data.rotationSettings[0] });
}
