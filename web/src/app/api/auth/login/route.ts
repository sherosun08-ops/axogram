import { NextRequest } from "next/server";
import { COOKIE_NAME, signToken, verifyPassword } from "@/lib/auth";
import { clientIp, error, json } from "@/lib/http";
import { createId, db, persist } from "@/lib/store";

const fails = new Map<string, { count: number; until: number }>();

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const ip = clientIp(req);
  const ua = req.headers.get("user-agent") || "";

  if (!email || !password) return error("البريد الإلكتروني وكلمة المرور مطلوبان");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error("صيغة البريد الإلكتروني غير صحيحة");

  const lock = fails.get(ip);
  if (lock && lock.until > Date.now()) {
    const left = Math.ceil((lock.until - Date.now()) / 1000);
    return error(`تم قفل الدخول مؤقتاً — حاول بعد ${left} ثانية`, 429);
  }

  const user = db().users.find((u) => u.email === email);
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;

  db().loginAttempts.unshift({
    id: createId(),
    userId: user?.id,
    email,
    ip,
    userAgent: ua,
    success: ok,
    reason: ok ? "ok" : "كلمة مرور خاطئة",
    createdAt: new Date().toISOString(),
  });
  persist();

  if (!ok) {
    const prev = fails.get(ip) || { count: 0, until: 0 };
    const count = prev.count + 1;
    if (count >= 5) {
      fails.set(ip, { count, until: Date.now() + 15 * 60 * 1000 });
      return error("تم قفل الدخول مؤقتاً بسبب كثرة المحاولات", 429);
    }
    fails.set(ip, { count, until: 0 });
    return error(`بيانات غير صحيحة — تبقّى ${5 - count} محاولات`, 401);
  }

  fails.delete(ip);
  const token = await signToken({ userId: user!.id, email: user!.email });
  db().sessions.push({
    id: createId(),
    userId: user!.id,
    token,
    ip,
    userAgent: ua,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  });
  db().notifications.unshift({
    id: createId(),
    title: "دخول جديد للوحة",
    body: `تم الدخول من ${ip}`,
    type: "info",
    read: false,
    href: "/settings/access",
    createdAt: new Date().toISOString(),
  });
  persist();

  const res = json({ ok: true, user: { id: user!.id, email: user!.email, name: user!.name } });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
  return res;
}
