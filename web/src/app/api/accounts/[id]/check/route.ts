import { json, requireUser, error } from "@/lib/http";
import { createId, db, persist } from "@/lib/store";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const acc = db().accounts.find((a) => a.id === params.id);
  if (!acc) return error("الحساب غير موجود", 404);
  const roll = Math.random();
  let status = acc.status;
  let message = "الحساب نشط وبلا مشاكل";
  if (acc.status === "banned") message = "الحساب محظور نهائياً";
  else if (acc.status === "dead_session") message = "انتهت الجلسة — يحتاج إعادة تسجيل دخول";
  else if (roll < 0.08) {
    status = "restricted_temp";
    message = "الحساب مقيد مؤقتاً";
  } else if (roll < 0.12) {
    status = "unmeasurable";
    message = "تعذر الاتصال بالحساب";
  }
  acc.status = status;
  acc.lastCheckedAt = new Date().toISOString();
  db().activityLogs.unshift({ id: createId(), accountId: acc.id, type: "system", level: status === "active" ? "success" : "warning", message, createdAt: new Date().toISOString() });
  persist();
  return json({ account: acc, message });
}
