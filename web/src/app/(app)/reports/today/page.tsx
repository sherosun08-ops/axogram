"use client";
import Link from "next/link";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { PeriodStats } from "@/components/prod";

export default function Page() {
  const { data, loading } = useApi<any>("/api/reports");
  if (loading) return <LoadingGrid />;
  const s = data?.summary || {};
  return (
    <div>
      <PageHeader title="تقرير اليوم" back="/reports" />
      <PeriodStats jobs={data?.jobs || []} />
      <Card className="mb-3 space-y-1 text-sm">
        <div>عمليات اليوم: {s.todayJobs}</div>
        <div>نجاح: {s.todaySuccess} · فشل: {s.todayFail}</div>
        <div>تجميع تراكمي: {s.gather} · إضافة تراكمية: {s.add}</div>
      </Card>
      <Link href="/reports/analytics" className="btn-ghost w-full">مقارنة تفصيلية</Link>
    </div>
  );
}
