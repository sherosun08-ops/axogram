"use client";
import Link from "next/link";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Resume() {
  const { data, loading } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const items = (data?.jobs||[]).filter((j:any)=>["partial","paused"].includes(j.status) && j.type==="add");
  return (
    <div>
      <PageHeader title="استئناف عملية سابقة" back="/adder" />
      <div className="space-y-2">
        {items.map((j:any)=>(
          <Card key={j.id} href={`/reports/live/${j.id}`}>
            <div className="font-bold">{j.title}</div>
            <div className="text-sm text-ink-muted">{j.successCount}/{j.total} · {j.status}</div>
          </Card>
        ))}
        {items.length===0 && <Empty title="لا عمليات جزئية" />}
      </div>
    </div>
  );
}
