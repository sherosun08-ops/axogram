"use client";
import { PageHeader, Card } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Page() {
  const { data, loading } = useApi<any>("/api/accounts");
  if (loading) return <LoadingGrid />;
  const list = [...(data?.accounts || [])].sort((a, b) => (b.usedAdd + b.usedGather) - (a.usedAdd + a.usedGather));
  return (
    <div>
      <PageHeader title="لوحة الترتيب" back="/reports" subtitle="أفضل الحسابات حسب النشاط" />
      <div className="space-y-2">
        {list.map((a, i) => (
          <Card key={a.id} className="flex justify-between">
            <span className="font-bold">{i + 1}. {a.firstName} {a.lastName}</span>
            <span className="text-sm text-ink-muted">صحة {a.healthScore}% · إضافة {a.usedAdd} · تجميع {a.usedGather}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
