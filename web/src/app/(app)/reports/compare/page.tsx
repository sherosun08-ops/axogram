"use client";
import { PageHeader, Card, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Page() {
  const { data, loading } = useApi<any>("/api/reports");
  if (loading) return <LoadingGrid />;
  const s = data?.summary || {};
  return (
    <div>
      <PageHeader title="مقارنة فترتين" back="/reports" />
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="font-bold mb-2">اليوم</div>
          <Stat label="نجاح" value={s.todaySuccess || 0} tone="success" />
        </Card>
        <Card>
          <div className="font-bold mb-2">التراكمي</div>
          <Stat label="تجميع + إضافة" value={(s.gather || 0) + (s.add || 0)} />
        </Card>
      </div>
    </div>
  );
}
