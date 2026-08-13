"use client";
import { PageHeader, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Page() {
  const { data, loading } = useApi<{ campaigns: any[] }>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns || []).filter((c) => c.kind === "groups");
  return (
    <div>
      <PageHeader title="إحصائيات حملات القروبات" back="/campaigns" />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="حملات" value={items.length} />
        <Stat label="أُرسل" value={items.reduce((s, c) => s + c.sentCount, 0)} tone="success" />
        <Stat label="فشل" value={items.reduce((s, c) => s + c.failCount, 0)} tone="danger" />
        <Stat label="نشطة" value={items.filter((c) => c.status === "running").length} tone="info" />
      </div>
    </div>
  );
}
