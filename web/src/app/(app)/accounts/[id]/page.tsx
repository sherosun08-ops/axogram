"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Button, Progress, Modal, Banner } from "@/components/ui";
import { LoadingGrid, useApi } from "@/components/data";
import { accountStatus, classification, healthTone } from "@/lib/labels";
import { api } from "@/lib/api-client";
import { formatDateTime, timeAgo } from "@/lib/utils";

type Acc = {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  phone: string;
  status: keyof typeof accountStatus;
  classification: keyof typeof classification;
  healthScore: number;
  isPremium: boolean;
  dc: number;
  estimatedAge?: string;
  usedGather: number;
  usedAdd: number;
  usedDm: number;
  floodWaitsWeek: number;
  groupsJoined: number;
  lastUsedAt?: string;
  device?: string;
  os?: string;
  appVersion?: string;
  twoFA: boolean;
  addedAt: string;
  group?: { name: string } | null;
  proxy?: { host: string; port: number; status: string } | null;
  restrictedUntil?: string;
};

export default function AccountDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, reload } = useApi<{ account: Acc }>(`/api/accounts/${id}`);
  const [msg, setMsg] = useState("");
  const [del, setDel] = useState(false);
  const [word, setWord] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <LoadingGrid />;
  const a = data?.account;
  if (!a) return <Banner tone="danger">الحساب غير موجود</Banner>;
  const st = accountStatus[a.status] || accountStatus.active;
  const cl = classification[a.classification] || classification.multi;
  const ht = healthTone(a.healthScore);

  async function check() {
    setBusy(true);
    const r = await api<{ message: string }>(`/api/accounts/${id}/check`, { method: "POST" });
    setMsg(r.message);
    setBusy(false);
    reload();
  }

  async function remove() {
    await api(`/api/accounts/${id}`, { method: "DELETE" });
    router.push("/accounts/list");
  }

  return (
    <div>
      <PageHeader title="تفاصيل الحساب" back="/accounts/list" />
      <div className="card mb-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-lg font-bold text-white">
            {a.firstName[0]}
          </div>
          <div>
            <div className="text-lg font-bold text-navy">{a.firstName} {a.lastName}</div>
            <div className="text-sm text-ink-muted">{a.username ? `@${a.username}` : "بدون username"} · {a.phone}</div>
            <div className="mt-1 text-sm">{st.icon} {st.label} {a.isPremium && "✦ Premium"}</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-ink-muted">مركز البيانات: DC {a.dc} · عمر تقديري: {a.estimatedAge} (غير رسمي)</div>
      </div>

      {msg && <Banner tone="info">{msg}</Banner>}

      <div className="card mb-4 p-4">
        <div className="mb-2 flex justify-between text-sm">
          <span>درجة الصحة</span>
          <span className={ht.color}>{a.healthScore}% {ht.label}</span>
        </div>
        <Progress value={a.healthScore} />
        <Link href="/accounts/score" className="mt-2 inline-block text-xs text-accent">شرح الدرجة ↗</Link>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="card p-3 text-center"><div className="text-lg font-bold">{a.usedGather}</div><div className="text-xs text-ink-muted">تجميع</div></div>
        <div className="card p-3 text-center"><div className="text-lg font-bold">{a.usedAdd}</div><div className="text-xs text-ink-muted">إضافة</div></div>
        <div className="card p-3 text-center"><div className="text-lg font-bold">{a.usedDm}</div><div className="text-xs text-ink-muted">DM</div></div>
      </div>
      <div className="mb-4 text-sm text-ink-muted">
        FloodWaits هذا الأسبوع: {a.floodWaitsWeek} · قروبات: {a.groupsJoined} · آخر استخدام: {timeAgo(a.lastUsedAt)}
      </div>

      <div className="card mb-4 space-y-1 p-4 text-sm">
        <div>الجهاز: {a.device} · {a.os} · {a.appVersion}</div>
        <div>التصنيف: {cl.icon} {cl.label}</div>
        <div>المجموعة: {a.group?.name || "—"}</div>
        <div>البروكسي: {a.proxy ? `${a.proxy.host}:${a.proxy.port} (${a.proxy.status})` : "—"}</div>
        <div>مضاف للأداة: {formatDateTime(a.addedAt)}</div>
        <div>التحقق بخطوتين: {a.twoFA ? "مفعّل" : "معطّل"}</div>
      </div>

      <div className="space-y-2">
        <Link href={`/accounts/${id}/settings`} className="btn-ghost w-full">✏️ تعديل المعلومات / إعدادات خاصة</Link>
        <Link href="/proxy/assign" className="btn-ghost w-full">🌐 تغيير البروكسي</Link>
        <Link href="/accounts/warmup" className="btn-ghost w-full">🔥 تسخين الحساب</Link>
        <Button variant="ghost" className="w-full" disabled={busy} onClick={check}>{busy ? "جاري الفحص..." : "✅ فحص الحالة الآن"}</Button>
        <Link href="/accounts/activity" className="btn-ghost w-full">📋 سجل النشاط</Link>
        <Link href="/accounts/export" className="btn-ghost w-full">📤 تصدير الجلسة</Link>
        {a.status === "dead_session" && <Link href="/accounts/add" className="btn-primary w-full">🔑 إعادة تسجيل الدخول</Link>}
        {(a.status === "restricted_temp" || a.status === "banned") && <Link href="/security/spambot" className="btn-ghost w-full">فحص حالة القيد عبر SpamBot</Link>}
        <Button variant="danger" className="w-full" onClick={() => setDel(true)}>حذف الحساب</Button>
      </div>

      <Modal open={del} danger title="حذف الحساب" onClose={() => setDel(false)} footer={
        <>
          <Button variant="ghost" onClick={() => setDel(false)}>إلغاء</Button>
          <Button variant="danger" disabled={word !== "حذف"} onClick={remove}>تأكيد الحذف</Button>
        </>
      }>
        سيُحذف من الأداة فقط وليس من تيليجرام. ستُؤرشف الجلسة ويُزال من التدوير.
        <input className="field mt-3" value={word} onChange={(e) => setWord(e.target.value)} placeholder='اكتب «حذف»' />
      </Modal>
    </div>
  );
}
