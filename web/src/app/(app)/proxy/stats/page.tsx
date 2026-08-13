"use client";
import { PageHeader, Stat, Card } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Page() {
  const { data, loading } = useApi<{ proxies: any[] }>("/api/proxies");
  if (loading) return <LoadingGrid />;
  const p = data?.proxies || [];
  const alive = p.filter((x) => x.status === "alive");
  const avg = alive.length ? Math.round(alive.reduce((s, x) => s + (x.latencyMs || 0), 0) / alive.length) : 0;
  return (
    <div>
      <PageHeader title="إحصائيات البروكسي" back="/proxy" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat label="الإجمالي" value={p.length} />
        <Stat label="حي" value={alive.length} tone="success" />
        <Stat label="ميت" value={p.filter((x) => x.status === "dead").length} tone="danger" />
        <Stat label="متوسط الكمون" value={`${avg}ms`} />
      </div>
      <Card>
        {Object.entries(p.reduce((m: any, x) => { m[x.country || "غير محدد"] = (m[x.country || "غير محدد"] || 0) + 1; return m; }, {})).map(([k, v]) => (
          <div key={k} className="flex justify-between py-1 text-sm"><span>{k}</span><span>{String(v)}</span></div>
        ))}
      </Card>
    </div>
  );
}
