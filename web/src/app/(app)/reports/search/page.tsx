"use client";
import { useMemo, useState } from "react";
import { PageHeader, Card, Input, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatDateTime } from "@/lib/utils";

export default function Page() {
  const { data, loading } = useApi<{ logs: any[] }>("/api/logs");
  const [q, setQ] = useState("");
  const items = useMemo(() => (data?.logs || []).filter((l) => !q || `${l.message} ${l.type}`.includes(q)), [data, q]);
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="بحث موحّد عبر السجلات" back="/reports" />
      <Input className="mb-3" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث أثناء الكتابة..." />
      {items.map((l) => (
        <Card key={l.id} className="mb-2">
          <div className="text-sm font-semibold">{l.message}</div>
          <div className="text-xs text-ink-muted">{l.type} · {formatDateTime(l.createdAt)}</div>
        </Card>
      ))}
      {items.length === 0 && <Empty title="لا نتائج" />}
    </div>
  );
}
