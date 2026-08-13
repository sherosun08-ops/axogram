"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function MsgHome() {
  const { data, loading } = useApi<{campaigns:any[]}>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const dms = (data?.campaigns||[]).filter((c:any)=>c.kind==="dm");
  return (
    <div>
      <PageHeader title="الرسائل الجماعية" subtitle="حملات DM عبر أسطول الحسابات" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="💬" label="حملات" value={dms.length} />
        <Stat icon="⚡" label="نشطة" value={dms.filter((c:any)=>c.status==="running").length} tone="info" />
      </div>
      <div className="space-y-2">
        <RowLink href="/messages/new" icon="➕" title="إنشاء حملة" />
        <RowLink href="/messages/list" icon="📋" title="عرض الحملات" />
        <RowLink href="/messages/resume" icon="▶️" title="استئناف متوقفة" />
        <RowLink href="/messages/blacklist" icon="🚫" title="القائمة السوداء" />
        <RowLink href="/messages/templates" icon="📄" title="قوالب الرسائل" />
        <RowLink href="/messages/stats" icon="📊" title="إحصائيات" />
        <RowLink href="/messages/settings" icon="⚙️" title="إعدادات افتراضية" />
      </div>
    </div>
  );
}
