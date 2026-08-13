"use client";
import Link from "next/link";
import { PageHeader, RowLink, Stat, Card, Progress } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function RotHome() {
  const { data, loading } = useApi<any>("/api/rotation");
  if (loading) return <LoadingGrid />;
  const slots = data?.slots || [];
  const active = slots.find((s:any)=>s.state==="active");
  return (
    <div>
      <PageHeader title="نظام التدوير" subtitle="توزيع الحمل على الحسابات لحماية الأسطول" />
      <Card className="mb-4">
        <div className="text-sm text-ink-muted">الوضع الحالي: {data?.settings?.mode} · {data?.settings?.enabled?"مفعّل":"متوقف"}</div>
        <div className="mt-2 font-bold text-navy">الحساب النشط: {active? `${active.account.firstName} ${active.account.lastName}` : "لا أحد"}</div>
        <div className="mt-3 text-xs">يُصفَّر يومياً الساعة {data?.settings?.dailyResetTime}</div>
      </Card>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="🟢" label="جاهز" value={slots.filter((s:any)=>s.state==="ready").length} tone="success" />
        <Stat icon="⚡" label="نشط" value={slots.filter((s:any)=>s.state==="active").length} tone="info" />
        <Stat icon="🧊" label="راحة" value={slots.filter((s:any)=>s.state==="resting").length} />
        <Stat icon="🚫" label="مستبعد" value={slots.filter((s:any)=>s.state==="excluded").length} tone="warning" />
      </div>
      <div className="space-y-2">
        <RowLink href="/rotation/settings" icon="⚙️" title="إعدادات التدوير" />
        <RowLink href="/rotation/table" icon="📋" title="جدول الدورة الحالي" />
        <RowLink href="/rotation/order" icon="↕️" title="تعديل الترتيب" />
        <RowLink href="/rotation/usage" icon="📊" title="الاستهلاك والحدود اليومية" />
        <RowLink href="/rotation/reset" icon="0️⃣" title="تصفير العدادات" />
        <RowLink href="/rotation/smart" icon="🧠" title="التدوير الذكي المتقدم" />
        <RowLink href="/rotation/schedule" icon="🗓️" title="جدولة دوام الدورة" />
        <RowLink href="/rotation/presets" icon="🎛️" title="سيناريوهات جاهزة" />
        <RowLink href="/rotation/analytics" icon="📈" title="تحليلات التدوير" />
        <RowLink href="/rotation/live" icon="📡" title="مراقب حي" />
        <RowLink href="/rotation/rules" icon="🚫" title="قواعد الاستبعاد التلقائي" />
        <RowLink href="/rotation/alerts" icon="🔔" title="إشعارات التدوير" />
        <RowLink href="/rotation/switches" icon="🔁" title="سجل التبديلات" />
        <RowLink href="/rotation/backup-group" icon="🛟" title="المجموعة الاحتياطية" />
      </div>
    </div>
  );
}
