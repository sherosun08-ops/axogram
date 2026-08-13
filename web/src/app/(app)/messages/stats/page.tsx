"use client";
import { PageHeader, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Page() {
  const { data, loading } = useApi<{ campaigns: any[] }>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const dms = (data?.campaigns || []).filter((c) => c.kind === "dm");
  return (
    <div>
      <PageHeader title="إحصائيات الرسائل" back="/messages" />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="حملات" value={dms.length} />
        <Stat label="أُرسل" value={dms.reduce((s, c) => s + c.sentCount, 0)} tone="success" />
        <Stat label="فشل" value={dms.reduce((s, c) => s + c.failCount, 0)} tone="danger" />
        <Stat label="نشطة" value={dms.filter((c) => c.status === "running").length} tone="info" />
      </div>
    </div>
  );
}
