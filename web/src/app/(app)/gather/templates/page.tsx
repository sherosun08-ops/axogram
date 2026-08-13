"use client";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Tpl() {
  const { data, loading } = useApi<{templates:any[]}>("/api/templates");
  if (loading) return <LoadingGrid />;
  const items = (data?.templates||[]).filter((t:any)=>t.kind==="gather");
  return (
    <div>
      <PageHeader title="قوالب التجميع" back="/gather" />
      <div className="space-y-2">
        {items.map((t:any)=>(<Card key={t.id}><div className="font-bold">{t.name}</div><div className="text-xs text-ink-muted">{t.content}</div></Card>))}
        {items.length===0 && <Empty title="لا قوالب" />}
      </div>
    </div>
  );
}
