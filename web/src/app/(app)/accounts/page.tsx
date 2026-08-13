"use client";

import Link from "next/link";
import { PageHeader, Stat, RowLink, Banner, Button } from "@/components/ui";
import { LoadingGrid, useApi } from "@/components/data";
import { accountStatus } from "@/lib/labels";
import { formatNumber, timeAgo } from "@/lib/utils";

type Acc = { id: string; status: string; lastCheckedAt?: string };
type Data = { accounts: Acc[]; fleetHealth: number };

export default function AccountsHome() {
  const { data, loading, error, reload } = useApi<Data>("/api/accounts");
  if (loading) return <LoadingGrid />;
  if (error) {
    return (
      <Banner tone="danger" action={<Button variant="ghost" onClick={reload}>إعادة المحاولة</Button>}>
        تعذر تحميل بيانات الحسابات — {error}
      </Banner>
    );
  }
  const accounts = data?.accounts || [];
  const count = (s: string) => accounts.filter((a) => a.status === s).length;
  const last = accounts[0]?.lastCheckedAt;

  return (
    <div>
      <PageHeader title="مدير الحسابات" subtitle="دورة حياة حسابات تيليجرام من الإضافة حتى الأرشفة" />
      <div className="card mb-4 p-5">
        <div className="flex items-center justify-between">
          <div className="font-bold text-navy">صحة الأسطول</div>
          <Link href="/accounts/health" className="text-sm text-accent">فحص 🔄</Link>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-success" style={{ width: `${data?.fleetHealth || 0}%` }} />
        </div>
        <div className="mt-2 text-sm text-ink-muted">{data?.fleetHealth || 0}% · آخر فحص: {timeAgo(last)}</div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon="🟢" label="نشط" value={formatNumber(count("active") + count("premium"))} tone="success" />
        <Stat icon="⚠️" label="مقيد" value={formatNumber(count("restricted_temp") + count("restricted_perm"))} tone="warning" />
        <Stat icon="⛔" label="محظور" value={formatNumber(count("banned"))} tone="danger" />
        <Stat icon="🔑" label="ميت" value={formatNumber(count("dead_session"))} />
        <Stat icon="❄️" label="مجمّد" value={formatNumber(count("frozen"))} tone="info" />
        <Stat icon="🔌" label="غير محدد" value={formatNumber(count("unmeasurable"))} />
        <Stat icon="👤" label="الإجمالي" value={formatNumber(accounts.length)} />
        <Stat icon="🔥" label="تسخين" value={formatNumber(count("warming"))} tone="warning" />
      </div>

      <div className="mb-3 font-bold text-navy">إجراءات سريعة</div>
      <div className="space-y-2">
        <RowLink href="/accounts/add" icon="➕" title="إضافة حساب جديد" hint="OTP أو QR Code" />
        <RowLink href="/accounts/import" icon="📁" title="استيراد جلسات" hint="ملفات session أو ZIP أو String" />
        <RowLink href="/accounts/health" icon="✅" title="فحص صحة الكل" hint="مركز عمليات الفحص" />
        <RowLink href="/accounts/warmup" icon="🔥" title="تسخين حسابات" hint="رفع درجة الصحة تدريجياً" />
        <RowLink href="/accounts/list" icon="👥" title="عرض كل الحسابات" hint={`${accounts.length} حساب`} />
      </div>

      <div className="mt-5 space-y-2">
        <RowLink href="/accounts/groups" icon="🗂️" title="مجموعات الحسابات" />
        <RowLink href="/accounts/score" icon="💊" title="درجة الصحة" />
        <RowLink href="/accounts/profile" icon="🖼️" title="مدير الملف الشخصي" />
        <RowLink href="/accounts/activity" icon="📋" title="سجل نشاط الحسابات" />
        <RowLink href="/accounts/security" icon="🛡️" title="أمان الحسابات" />
        <RowLink href="/accounts/export" icon="📤" title="تصدير واستيراد" />
        <RowLink href="/accounts/inactive" icon="🧹" title="إدارة غير النشطة" />
      </div>

      {accounts.some((a) => ["restricted_temp", "banned", "dead_session"].includes(a.status)) && (
        <div className="mt-5">
          <Banner tone="warning" action={<Link href="/accounts/list" className="font-semibold">عرض</Link>}>
            ⚠️ تغيّرت حالة بعض الحسابات منذ آخر زيارة
          </Banner>
        </div>
      )}

      {accounts.length === 0 && (
        <div className="mt-6 text-center text-sm text-ink-muted">
          لا حسابات بعد — أضف حسابك الأول للبدء
          <div className="mt-3 flex justify-center gap-2">
            <Link href="/accounts/add" className="btn-primary">إضافة حساب جديد</Link>
            <Link href="/accounts/import" className="btn-ghost">استيراد جلسات</Link>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-ink-muted">
        الحالات المعتمدة: {Object.values(accountStatus).map((s) => s.label).join(" · ")}
      </div>
    </div>
  );
}
