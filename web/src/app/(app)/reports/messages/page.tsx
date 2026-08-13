"use client";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatDateTime } from "@/lib/utils";
export default function Page() {
  const { data, loading } = useApi<{ campaigns: any[] }>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns || []).filter((c) => c.kind === "dm");
  return (
    <div>
      <PageHeader title="سجل الرسائل" back="/reports" />
      {items.map((c) => (
        <Card key={c.id} className="mb-2">
          <div className="font-bold">{c.name}</div>
          <div className="text-sm text-ink-muted">{c.status} · {c.sentCount}/{c.targetsCount} · {formatDateTime(c.createdAt)}</div>
        </Card>
      ))}
      {items.length === 0 && <Empty title="لا بيانات" />}
    </div>
  );
}
