"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader, Button, Field, Input, Radio, Banner, Card } from "@/components/ui";
import { useApi } from "@/components/data";
import { api } from "@/lib/api-client";

const steps = ["رقم الهاتف", "الكود", "التحقق", "التصنيف"];

export default function AddAccount() {
  const router = useRouter();
  const { data } = useApi<{ groups: { id: string; name: string }[]; accounts: { proxyId?: string }[] }>("/api/accounts");
  const { data: px } = useApi<{ proxies: { id: string; host: string; port: number }[] }>("/api/proxies");
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("+966");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [need2fa, setNeed2fa] = useState(false);
  const [cls, setCls] = useState("multi");
  const [groupId, setGroupId] = useState("");
  const [proxyId, setProxyId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);

  const phoneOk = /^\+\d{8,15}$/.test(phone);

  function onDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    const el = document.getElementById(`otp-${i + 1}`);
    if (d && el) (el as HTMLInputElement).focus();
  }

  async function sendCode() {
    setError("");
    if (!phoneOk) return setError("يجب أن يبدأ الرقم برمز الدولة مثل +966");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    setBusy(false);
    setStep(1);
  }

  async function confirmCode() {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    const joined = code.join("");
    if (joined !== "12345" && joined !== "00000") {
      const t = tries + 1;
      setTries(t);
      setBusy(false);
      setCode(["", "", "", "", ""]);
      setError(`الكود غير صحيح — المحاولة ${t} من 5`);
      if (t >= 5) setError("تجاوزت الحد — سيُرسل كود جديد");
      return;
    }
    setBusy(false);
    setNeed2fa(joined === "00000");
    setStep(joined === "00000" ? 2 : 3);
  }

  async function save() {
    setBusy(true);
    try {
      const acc = await api<{ account: { id: string } }>("/api/accounts", {
        method: "POST",
        body: JSON.stringify({
          phone,
          firstName: "حساب",
          lastName: "جديد",
          classification: cls,
          groupId: groupId || null,
          proxyId: proxyId || null,
        }),
      });
      router.push(`/accounts/${acc.account.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const groups = data?.groups || [];
  const proxies = px?.proxies || [];
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  return (
    <div>
      <PageHeader title="إضافة حساب جديد" back="/accounts" />
      <div className="mb-4 flex gap-2 text-xs">
        {steps.map((s, i) => (
          <div key={s} className={i <= step ? "font-bold text-accent" : "text-ink-muted"}>
            {i + 1}. {s}
          </div>
        ))}
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
      </div>
      {error && <Banner tone="danger">{error}</Banner>}

      {step === 0 && (
        <Card>
          <Field label="رقم الهاتف" hint="مثال: +9665XXXXXXXX">
            <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))} />
          </Field>
          <Banner tone="info">يُرسل الكود داخل تطبيق تيليجرام على هاتفك</Banner>
          <Button className="mt-2 w-full" disabled={!phoneOk || busy} onClick={sendCode}>
            {busy ? "جاري الإرسال..." : "إرسال الكود"}
          </Button>
          <Link href="/accounts/add/qr" className="btn-ghost mt-3 w-full">📷 تسجيل الدخول بـ QR Code</Link>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <div className="mb-3 text-sm text-ink-muted">أُرسل الكود داخل تطبيق تيليجرام</div>
          <div className="mb-4 flex justify-center gap-2" dir="ltr">
            {code.map((c, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                value={c}
                maxLength={1}
                onChange={(e) => onDigit(i, e.target.value)}
                className="h-12 w-10 rounded-xl border text-center text-lg font-bold"
              />
            ))}
          </div>
          <p className="mb-3 text-center text-xs text-ink-muted">للتجربة استخدم 12345 أو 00000 لمسار 2FA</p>
          <Button className="w-full" disabled={code.join("").length < 5 || busy} onClick={confirmCode}>
            {busy ? "جاري التحقق..." : "تأكيد الكود"}
          </Button>
          <Button variant="ghost" className="mt-2 w-full" onClick={() => setStep(0)}>تغيير الرقم</Button>
        </Card>
      )}

      {step === 2 && need2fa && (
        <Card>
          <Banner tone="warning">هذا الحساب محمي بالتحقق بخطوتين</Banner>
          <Field label="كلمة مرور التحقق بخطوتين">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Button className="mt-3 w-full" disabled={!password} onClick={() => setStep(3)}>تأكيد</Button>
          <Link href="/security/2fa" className="mt-3 block text-center text-sm text-accent">نسيت كلمة المرور؟</Link>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <div className="mb-4 text-lg font-bold text-success">✅ تم تسجيل الدخول بنجاح</div>
          <div className="mb-4 rounded-xl bg-slate-50 p-3 text-sm">
            <div>{phone}</div>
            <div className="text-ink-muted">مركز البيانات: DC 4 · عمر تقديري غير معروف بعد</div>
          </div>
          <div className="mb-3 font-semibold">التصنيف</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["primary", "رئيسي 🔴"],
              ["backup", "احتياطي 🟡"],
              ["gather", "تجميع 🟢"],
              ["add", "إضافة 🔵"],
              ["multi", "متعدد ⚪"],
            ].map(([v, l]) => (
              <Radio key={v} name="cls" value={v} checked={cls === v} onChange={setCls} label={l} />
            ))}
          </div>
          <Field label="مجموعة (اختياري)" >
            <select className="field mt-3" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
              <option value="">بدون مجموعة</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </Field>
          <Field label="بروكسي (اختياري)">
            <select className="field mt-3" value={proxyId} onChange={(e) => setProxyId(e.target.value)}>
              <option value="">بدون بروكسي</option>
              {proxies.map((p) => <option key={p.id} value={p.id}>{p.host}:{p.port}</option>)}
            </select>
          </Field>
          <Button className="mt-4 w-full" disabled={busy} onClick={save}>{busy ? "جاري الحفظ..." : "حفظ الحساب"}</Button>
        </Card>
      )}
    </div>
  );
}
