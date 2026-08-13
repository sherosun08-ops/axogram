"use client";
import Link from "next/link";
import { PageHeader, Card, Button, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
export default function Page() {
  const { data, loading, reload } = useApi<{ jobs: any[] }>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const items = (data?.jobs || []).filter((j) => j.type === "gather" && ["partial", "paused"].includes(j.status));
  return (
    <div>
      <PageHeader title="استئناف تجميع جزئي" back="/gather" />
      {items.map((j) => (
        <Card key={j.id} className="mb-2">
          <div className="font-bold">{j.title}</div>
          <div className="text-sm">{j.successCount}/{j.total} · {j.status}</div>
          <div className="mt-2 flex gap-2">
            <Link href={`/reports/live/${j.id}`} className="btn-ghost">تفاصيل</Link>
            <Button onClick={async () => { await api(`/api/jobs/${j.id}`, { method: "PATCH", body: JSON.stringify({ status: "running" }) }); reload(); }}>استئناف</Button>
          </div>
        </Card>
      ))}
      {items.length === 0 && <Empty title="لا عمليات جزئية" />}
    </div>
  );
}
