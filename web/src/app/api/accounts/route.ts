import { error, json, requireUser } from "@/lib/http";
import { createId, db, persist, withAccount } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  const data = db();
  const accounts = data.accounts.map((a) => withAccount(a, data));
  const groups = data.accountGroups.map((g) => ({ ...g, _count: { accounts: data.accounts.filter((a) => a.groupId === g.id).length } }));
  const fleetHealth = accounts.length ? Math.round(accounts.reduce((s, a) => s + a.healthScore, 0) / accounts.length) : 0;
  return json({ accounts, groups, fleetHealth });
}

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone || "").trim();
  if (!phone.startsWith("+") || phone.length < 8) return error("الرقم غير صالح — تحقق من الصيغة الدولية");
  if (db().accounts.some((a) => a.phone === phone)) return error("هذا الحساب موجود مسبقاً");
  const account = {
    id: createId(),
    phone,
    firstName: body.firstName || "حساب",
    lastName: body.lastName || "جديد",
    username: body.username || null,
    status: "active",
    classification: body.classification || "multi",
    groupId: body.groupId || null,
    proxyId: body.proxyId || null,
    telegramId: String(200000000 + Math.floor(Math.random() * 700000000)),
    healthScore: 70,
    dc: 4,
    estimatedAge: "غير معروف",
    device: "TeleCore Web",
    os: "Web",
    appVersion: "1.0.0",
    isPremium: false,
    twoFA: false,
    dailyGatherLimit: 500,
    dailyAddLimit: 20,
    dailyDmLimit: 30,
    dailyCampaignLimit: 25,
    usedGather: 0,
    usedAdd: 0,
    usedDm: 0,
    usedCampaign: 0,
    rotationPriority: "medium",
    allowGather: true,
    allowAdd: true,
    allowDm: true,
    allowCampaign: true,
    inRotation: true,
    lastCheckedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    addedAt: new Date().toISOString(),
  };
  db().accounts.unshift(account);
  db().activityLogs.unshift({ id: createId(), accountId: account.id, type: "system", level: "success", message: "تم إضافة حساب جديد", createdAt: new Date().toISOString() });
  persist();
  return json({ account });
}

export async function DELETE(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const { ids } = await req.json();
  if (!Array.isArray(ids) || !ids.length) return error("لا حسابات محددة");
  const data = db();
  data.accounts = data.accounts.filter((a) => !ids.includes(a.id));
  persist();
  return json({ ok: true });
}
