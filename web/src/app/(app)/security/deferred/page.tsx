"use client";
import { PageHeader, Card, Empty, Banner } from "@/components/ui";
import { useApi } from "@/components/data";
export default function Page() {
  const { data } = useApi<any>("/api/accounts");
  const fresh = (data?.accounts || []).filter((a: any) => a.status === "warming" || (a.estimatedAge || "").includes("أسبوع"));
  return (
    <div>
      <PageHeader title="المهام المؤجلة" back="/security" subtitle="SESSION_TOO_FRESH — حسابات جديدة جداً للتسخين أولاً" />
      {fresh.length > 0 && <Banner tone="warning">{fresh.length} حساب مؤجّل حتى يكتمل التسخين</Banner>}
      {fresh.map((a: any) => (
        <Card key={a.id} className="mb-2">
          <div className="font-bold">{a.firstName} {a.lastName}</div>
          <div className="text-sm text-ink-muted">{a.status} · عمر {a.estimatedAge} · صحة {a.healthScore}%</div>
        </Card>
      ))}
      {fresh.length === 0 && <Empty title="لا مهام مؤجلة" />}
    </div>
  );
}
