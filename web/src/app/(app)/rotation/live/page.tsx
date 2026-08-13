"use client";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Live() {
  const { data, loading } = useApi<any>("/api/rotation");
  if (loading) return <LoadingGrid />;
  const active = (data?.slots||[]).find((s:any)=>s.state==="active");
  return (
    <div>
      <PageHeader title="المراقب الحي" back="/rotation" />
      <Card className="mb-3">
        <div className="text-sm text-ink-muted">الحساب النشط الآن</div>
        <div className="text-xl font-bold text-navy">{active? `${active.account.firstName} ${active.account.lastName}`:"—"}</div>
        <div className="text-sm">المستخدم اليوم: {active?.usedToday || 0}</div>
      </Card>
      <div className="space-y-2">
        {(data?.slots||[]).map((s:any)=>(
          <div key={s.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm border">
            <span>{s.account.firstName}</span>
            <span>{s.state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
