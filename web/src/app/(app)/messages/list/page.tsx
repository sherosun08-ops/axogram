"use client";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { campaignStatus } from "@/lib/labels";
import { api } from "@/lib/api-client";
export default function List() {
  const { data, loading, reload } = useApi<{campaigns:any[]}>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns||[]).filter((c:any)=>c.kind==="dm");
  return (
    <div>
      <PageHeader title="حملات الرسائل" back="/messages" />
      <div className="space-y-2">
        {items.map((c:any)=>(
          <Card key={c.id}>
            <div className="flex justify-between">
              <div className="font-bold">{c.name}</div>
              <span className={`chip ${(campaignStatus as any)[c.status]?.bg}`}>{(campaignStatus as any)[c.status]?.label}</span>
            </div>
            <div className="text-sm text-ink-muted">{c.sentCount}/{c.targetsCount} · فشل {c.failCount}</div>
            <div className="mt-2 flex gap-2">
              {c.status!=="running" && <Button variant="ghost" onClick={async()=>{await api(`/api/campaigns/${c.id}`,{method:"PATCH",body:JSON.stringify({status:"running"})}); reload();}}>تشغيل</Button>}
              {c.status==="running" && <Button variant="ghost" onClick={async()=>{await api(`/api/campaigns/${c.id}`,{method:"PATCH",body:JSON.stringify({status:"paused"})}); reload();}}>إيقاف</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
