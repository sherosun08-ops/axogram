"use client";
import { PageHeader } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { LogList, PeriodStats } from "@/components/prod";
export default function Page() {
  const { data, loading } = useApi<any>("/api/reports");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="تقرير أسبوعي" back="/reports" subtitle="الأسبوع الحالي" />
      <PeriodStats jobs={data?.jobs || []} />
      <LogList />
    </div>
  );
}
