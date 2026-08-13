"use client";
import { PageHeader, Card, Segment } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatDateTime } from "@/lib/utils";
import { useState } from "react";

export default function Page() {
  const { data, loading } = useApi<{ logs: any[] }>("/api/logs");
  const [tab, setTab] = useState("error");
  if (loading) return <LoadingGrid />;
  const logs = (data?.logs || []).filter((l) => tab === "all" || l.level === tab);
  return (
    <div>
      <PageHeader title="سجل الأخطاء والتحذيرات" back="/reports" />
      <Segment value={tab} onChange={setTab} options={[{ id: "error", label: "أخطاء" }, { id: "warning", label: "تحذيرات" }, { id: "all", label: "الكل" }]} />
      <div className="mt-3 space-y-2">
        {logs.map((l) => (
          <Card key={l.id}>
            <div className="font-semibold">{l.level === "error" ? "❌" : "⚠️"} {l.message}</div>
            <div className="text-xs text-ink-muted">{l.type} · {formatDateTime(l.createdAt)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
