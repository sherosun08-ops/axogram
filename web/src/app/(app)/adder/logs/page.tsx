"use client";
import { PageHeader, Card, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatDateTime } from "@/lib/utils";
export default function Logs() {
  const { data, loading } = useApi<{logs:any[]}>("/api/logs?type=add");
  const { data: jobs } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const adds = (jobs?.jobs||[]).filter((j:any)=>j.type==="add");
  return (
    <div>
      <PageHeader title="سجلات وإحصائيات الإضافة" back="/adder" />
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Stat label="عمليات" value={adds.length} />
        <Stat label="نجاح" value={adds.reduce((s:number,j:any)=>s+j.successCount,0)} tone="success" />
        <Stat label="فشل" value={adds.reduce((s:number,j:any)=>s+j.failCount,0)} tone="danger" />
      </div>
      <div className="space-y-2">
        {(data?.logs||[]).map((l:any)=>(
          <Card key={l.id}><div className="text-sm">{l.message}</div><div className="text-xs text-ink-muted">{formatDateTime(l.createdAt)}</div></Card>
        ))}
      </div>
    </div>
  );
}
