"use client";
import Link from "next/link";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { jobStatus } from "@/lib/labels";
export default function LiveCenter() {
  const { data, loading } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const jobs = data?.jobs||[];
  return (
    <div>
      <PageHeader title="مركز العمليات الحية" back="/reports" />
      <div className="space-y-2">
        {jobs.map((j:any)=>(
          <Link key={j.id} href={`/reports/live/${j.id}`} className="card block p-4">
            <div className="flex justify-between">
              <div className="font-bold text-navy">{j.title}</div>
              <span className={`chip ${(jobStatus as any)[j.status]?.bg} ${(jobStatus as any)[j.status]?.color}`}>{(jobStatus as any)[j.status]?.label}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-accent" style={{width:`${j.total? (j.progress/j.total)*100:0}%`}} /></div>
            <div className="mt-1 text-xs text-ink-muted">{j.progress}/{j.total} · نجاح {j.successCount} · فشل {j.failCount}</div>
          </Link>
        ))}
        {jobs.length===0 && <Empty title="لا عمليات" />}
      </div>
    </div>
  );
}
