"use client";
import { PageHeader } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { LogList, PeriodStats } from "@/components/prod";

export default function Page() {
  const { data, loading } = useApi<{ jobs: any[] }>("/api/jobs");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="إحصائيات التجميع" back="/gather" />
      <PeriodStats jobs={data?.jobs || []} kind="gather" />
      <LogList type="gather" />
    </div>
  );
}
