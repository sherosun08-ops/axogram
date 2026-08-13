"use client";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Page() {
  const { data, loading } = useApi<{ groups: any[] }>("/api/proxies");
  if (loading) return <LoadingGrid />;
  const groups = data?.groups || [];
  return (
    <div>
      <PageHeader title="مجموعات البروكسيهات" back="/proxy" />
      <div className="space-y-2">
        {groups.map((g) => (
          <Card key={g.id}>
            <div className="font-bold">{g.name}</div>
            <div className="text-sm text-ink-muted">{g.description} · {g.proxies?.length || 0} بروكسي</div>
          </Card>
        ))}
        {groups.length === 0 && <Empty title="لا مجموعات" />}
      </div>
    </div>
  );
}
