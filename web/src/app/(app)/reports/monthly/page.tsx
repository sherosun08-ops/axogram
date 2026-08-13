"use client";
import { PageHeader, Card } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { PeriodStats } from "@/components/prod";
export default function Page() {
  const { data, loading } = useApi<any>("/api/reports");
  if (loading) return <LoadingGrid />;
  const by = (data?.jobs || []).reduce((m: any, j: any) => { m[j.type] = (m[j.type] || 0) + j.successCount; return m; }, {});
  return (
    <div>
      <PageHeader title="تقرير شهري" back="/reports" />
      <PeriodStats jobs={data?.jobs || []} />
      <Card>
        <div className="font-bold mb-2">جدول رقمي حسب النوع</div>
        {Object.entries(by).map(([k, v]) => <div key={k} className="flex justify-between text-sm py-1"><span>{k}</span><span>{String(v)}</span></div>)}
      </Card>
    </div>
  );
}
