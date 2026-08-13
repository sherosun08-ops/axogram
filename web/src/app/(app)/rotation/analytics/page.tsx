"use client";
import { PageHeader, Card } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { PeriodStats } from "@/components/prod";
export default function Page() {
  const { data, loading } = useApi<any>("/api/rotation");
  const { data: jobs } = useApi<{ jobs: any[] }>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const slots = data?.slots || [];
  return (
    <div>
      <PageHeader title="تحليلات التدوير" back="/rotation" />
      <PeriodStats jobs={jobs?.jobs || []} />
      <Card>
        <div className="font-bold mb-2">توزيع الاستهلاك</div>
        {slots.map((s: any) => (
          <div key={s.id} className="flex justify-between py-1 text-sm"><span>{s.account.firstName}</span><span>{s.usedToday}</span></div>
        ))}
      </Card>
    </div>
  );
}
