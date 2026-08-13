"use client";
import { PageHeader, Card, Button, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { campaignStatus } from "@/lib/labels";
import { api } from "@/lib/api-client";
export default function Page() {
  const { data, loading, reload } = useApi<{ campaigns: any[] }>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns || []).filter((c) => c.kind === "groups");
  return (
    <div>
      <PageHeader title="حملات القروبات" back="/campaigns" />
      {items.map((c) => (
        <Card key={c.id} className="mb-2">
          <div className="flex justify-between"><div className="font-bold">{c.name}</div><span className="chip bg-slate-100">{(campaignStatus as any)[c.status]?.label}</span></div>
          <div className="text-sm text-ink-muted">{c.sentCount}/{c.targetsCount}</div>
          <Button className="mt-2" variant="ghost" onClick={async () => { await api(`/api/campaigns/${c.id}`, { method: "PATCH", body: JSON.stringify({ status: c.status === "running" ? "paused" : "running" }) }); reload(); }}>
            {c.status === "running" ? "إيقاف" : "تشغيل"}
          </Button>
        </Card>
      ))}
      {items.length === 0 && <Empty title="لا حملات" />}
    </div>
  );
}
