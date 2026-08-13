"use client";
import Link from "next/link";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatDateTime } from "@/lib/utils";
export default function Screen() {
  const { data, loading } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const items = (data?.jobs||[]).filter((j:any)=> "gather"==="" || j.type==="gather");
  return (
    <div>
      <PageHeader title="سجل التجميع" back="/reports" />
      <div className="space-y-2">
        {items.map((j:any)=>(
          <Link key={j.id} href={`/reports/live/${j.id}`} className="card block p-4">
            <div className="font-bold">{j.title}</div>
            <div className="text-sm text-ink-muted">{j.status} · نجاح {j.successCount} · {formatDateTime(j.createdAt)}</div>
          </Link>
        ))}
        {items.length===0 && <Empty title="لا بيانات" />}
      </div>
    </div>
  );
}
