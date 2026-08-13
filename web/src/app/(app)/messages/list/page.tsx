"use client";
import { PageHeader, Card, Button, Segment, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { campaignStatus } from "@/lib/labels";
import { api } from "@/lib/api-client";
import { useState } from "react";

export default function Page() {
  const { data, loading, reload } = useApi<{ campaigns: any[] }>("/api/campaigns");
  const [tab, setTab] = useState("all");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns || []).filter((c) => c.kind === "dm" && (tab === "all" || c.status === tab));
  return (
    <div>
      <PageHeader title="حملات الرسائل" back="/messages" />
      <Segment value={tab} onChange={setTab} options={[{ id: "all", label: "الكل" }, { id: "running", label: "نشطة" }, { id: "paused", label: "متوقفة" }, { id: "draft", label: "مسودة" }, { id: "completed", label: "مكتملة" }]} />
      <div className="mt-3 space-y-2">
        {items.map((c) => (
          <Card key={c.id}>
            <div className="flex justify-between">
              <div className="font-bold">{c.name}</div>
              <span className={`chip ${(campaignStatus as any)[c.status]?.bg}`}>{(campaignStatus as any)[c.status]?.label}</span>
            </div>
            <div className="text-sm text-ink-muted">{c.sentCount}/{c.targetsCount} · فشل {c.failCount}</div>
            <div className="mt-2 text-sm text-ink-muted line-clamp-2">{c.message}</div>
            <div className="mt-2 flex gap-2">
              {c.status !== "running" && <Button variant="ghost" onClick={async () => { await api(`/api/campaigns/${c.id}`, { method: "PATCH", body: JSON.stringify({ status: "running" }) }); reload(); }}>تشغيل</Button>}
              {c.status === "running" && <Button variant="ghost" onClick={async () => { await api(`/api/campaigns/${c.id}`, { method: "PATCH", body: JSON.stringify({ status: "paused" }) }); reload(); }}>إيقاف</Button>}
            </div>
          </Card>
        ))}
        {items.length === 0 && <Empty title="لا حملات" />}
      </div>
    </div>
  );
}
