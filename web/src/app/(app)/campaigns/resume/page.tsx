"use client";
import { PageHeader, Card, Button, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
export default function Page() {
  const { data, loading, reload } = useApi<{ campaigns: any[] }>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns || []).filter((c) => c.kind === "groups" && ["paused", "draft"].includes(c.status));
  return (
    <div>
      <PageHeader title="استئناف حملات القروبات" back="/campaigns" />
      {items.map((c) => (
        <Card key={c.id} className="mb-2 flex justify-between">
          <div><div className="font-bold">{c.name}</div><div className="text-sm">{c.sentCount}/{c.targetsCount}</div></div>
          <Button onClick={async () => { await api(`/api/campaigns/${c.id}`, { method: "PATCH", body: JSON.stringify({ status: "running" }) }); reload(); }}>استئناف</Button>
        </Card>
      ))}
      {items.length === 0 && <Empty title="لا حملات متوقفة" />}
    </div>
  );
}
