"use client";
import { PageHeader, RowLink, Stat, Card, Banner } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Page() {
  const { data, loading } = useApi<any>("/api/dashboard");
  if (loading) return <LoadingGrid />;
  const c = data?.counts || {};
  return (
    <div>
      <PageHeader title="أدوات الأمان" subtitle="حماية الحسابات والاستجابة للطوارئ" />
      {c.banned > 0 && <Banner tone="danger">يوجد حسابات محظورة تحتاج مراجعة</Banner>}
      <Card className="mb-4">
        <div className="font-bold text-navy">حالة الأمان العامة</div>
        <div className="mt-1 text-success">المراقب يعمل — راجع الحالات الحرجة أدناه</div>
      </Card>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="⛔" label="محظور" value={c.banned || 0} tone="danger" />
        <Stat icon="❄️" label="مجمّد" value={c.frozen || 0} tone="info" />
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
        <RowLink href="/security/deferred" icon="⏳" title="المهام المؤجلة" />
      </div>
    </div>
  );
}
