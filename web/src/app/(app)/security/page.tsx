"use client";
import { PageHeader, RowLink, Stat, Card } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function SecHome() {
  const { data, loading } = useApi<any>("/api/dashboard");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="أدوات الأمان" subtitle="حماية الحسابات والاستجابة للطوارئ" />
      <Card className="mb-4">
        <div className="font-bold text-navy">حالة الأمان العامة</div>
        <div className="mt-1 text-success">🟢 ممتاز — لا حالات حرجة مفتوحة</div>
      </Card>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="⛔" label="محظور" value={data?.counts.banned||0} tone="danger" />
        <Stat icon="❄️" label="مجمّد" value={data?.counts.frozen||0} tone="info" />
      </div>
      <div className="space-y-2">
        <RowLink href="/security/blacklist" icon="🚫" title="القائمة السوداء العالمية" />
        <RowLink href="/security/limits" icon="🧠" title="الحدود الذكية" />
        <RowLink href="/security/scan" icon="🛡️" title="فحص أمان شامل" />
        <RowLink href="/security/devices" icon="📱" title="مراقبة الأجهزة المتصلة" />
        <RowLink href="/security/ban-monitor" icon="📡" title="مراقب الحظر الحي" />
        <RowLink href="/security/cleanup" icon="🧹" title="تنظيف الحسابات" />
        <RowLink href="/security/2fa" icon="🔐" title="إدارة كلمات مرور 2FA" />
        <RowLink href="/security/encryption" icon="🔒" title="تشفير الجلسات والبيانات" />
        <RowLink href="/security/emergency" icon="🔴" title="الاستجابة للطوارئ" />
        <RowLink href="/security/alerts" icon="🔔" title="تنبيهات الأمان" />
        <RowLink href="/security/reports" icon="📊" title="تقارير الأمان" />
        <RowLink href="/security/spambot" icon="🤖" title="فحص SpamBot" />
      </div>
    </div>
  );
}
