"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function CampHome() {
  const { data, loading } = useApi<{campaigns:any[]}>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns||[]).filter((c:any)=>c.kind==="groups");
  return (
    <div>
      <PageHeader title="حملات القروبات" subtitle="إرسال إلى قروبات متعددة بجدول وحماية" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="📢" label="حملات" value={items.length} />
        <Stat icon="⚡" label="نشطة" value={items.filter((c:any)=>c.status==="running").length} tone="info" />
      </div>
      <div className="space-y-2">
        <RowLink href="/campaigns/new" icon="➕" title="إنشاء حملة" />
        <RowLink href="/campaigns/list" icon="📋" title="عرض الحملات" />
        <RowLink href="/campaigns/resume" icon="▶️" title="استئناف متوقفة" />
        <RowLink href="/campaigns/directory" icon="📚" title="دليل القروبات" />
        <RowLink href="/campaigns/templates" icon="📄" title="قوالب رسائل القروبات" />
        <RowLink href="/campaigns/schedule" icon="🗓️" title="جدولة الحملات" />
        <RowLink href="/campaigns/stats" icon="📊" title="إحصائيات وتقارير" />
        <RowLink href="/campaigns/settings" icon="⚙️" title="إعدادات افتراضية" />
      </div>
    </div>
  );
}
