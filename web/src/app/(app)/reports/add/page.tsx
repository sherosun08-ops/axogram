"use client";
import Link from "next/link";
import { PageHeader, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatDateTime } from "@/lib/utils";
export default function Page() {
  const { data, loading } = useApi<{ jobs: any[] }>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const items = (data?.jobs || []).filter((j) => j.type === "add");
  return (
    <div>
      <PageHeader title="سجل الإضافة" back="/reports" />
      {items.map((j) => (
        <Link key={j.id} href={`/reports/live/${j.id}`} className="card mb-2 block p-4">
          <div className="font-bold">{j.title}</div>
          <div className="text-sm text-ink-muted">{j.status} · نجاح {j.successCount} · {formatDateTime(j.createdAt)}</div>
        </Link>
      ))}
      {items.length === 0 && <Empty title="لا بيانات" />}
    </div>
  );
}
