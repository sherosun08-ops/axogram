"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function ProxyHome() {
  const { data, loading } = useApi<{proxies:any[]}>("/api/proxies");
  if (loading) return <LoadingGrid />;
  const p = data?.proxies||[];
  return (
    <div>
      <PageHeader title="مدير البروكسي" subtitle="إدارة المسارات وتعيينها للحسابات" />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon="🟢" label="نشط" value={p.filter((x:any)=>x.status==="alive").length} tone="success" />
        <Stat icon="⛔" label="ميت" value={p.filter((x:any)=>x.status==="dead").length} tone="danger" />
        <Stat icon="🐢" label="بطيء" value={p.filter((x:any)=>x.status==="slow").length} tone="warning" />
        <Stat icon="❔" label="غير مفحوص" value={p.filter((x:any)=>x.status==="unknown").length} />
      </div>
      <div className="space-y-2">
        <RowLink href="/proxy/add" icon="➕" title="إضافة بروكسي" />
        <RowLink href="/proxy/import" icon="📥" title="استيراد قائمة" />
        <RowLink href="/proxy/list" icon="📋" title="عرض البروكسيهات" hint={`${p.length} بروكسي`} />
        <RowLink href="/proxy/health" icon="✅" title="فحص الصحة" />
        <RowLink href="/proxy/assign" icon="🔗" title="تعيين للحسابات" />
        <RowLink href="/proxy/groups" icon="🗂️" title="مجموعات البروكسيهات" />
        <RowLink href="/proxy/replace" icon="♻️" title="استبدال الميتة" />
        <RowLink href="/proxy/cleanup" icon="🧹" title="إزالة غير النشطة" />
        <RowLink href="/proxy/stats" icon="📊" title="إحصائيات" />
        <RowLink href="/proxy/export" icon="📤" title="تصدير" />
        <RowLink href="/proxy/alerts" icon="🔔" title="الإشعارات" />
        <RowLink href="/proxy/settings" icon="⚙️" title="إعدادات عامة" />
      </div>
    </div>
  );
}
