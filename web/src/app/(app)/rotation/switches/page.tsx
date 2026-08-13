"use client";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatDateTime } from "@/lib/utils";

export default function Page() {
  const { data, loading } = useApi<any>("/api/logs?type=system");
  if (loading) return <LoadingGrid />;
  const logs = data?.logs || [];
  return (
    <div>
      <PageHeader title="سجل التبديلات" back="/rotation" />
      <div className="space-y-2">
        {logs.map((l: any) => (
          <Card key={l.id}>
            <div className="text-sm">{l.message}</div>
            <div className="text-xs text-ink-muted">{formatDateTime(l.createdAt)}</div>
          </Card>
        ))}
        {logs.length === 0 && <Empty title="لا تبديلات بعد" />}
      </div>
    </div>
  );
}
