"use client";
import { PageHeader, Card } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { rotationState } from "@/lib/labels";
export default function Table() {
  const { data, loading } = useApi<any>("/api/rotation");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="جدول الدورة الحالي" back="/rotation" />
      <div className="space-y-2">
        {(data?.slots||[]).map((s:any)=>(
          <Card key={s.id} className="flex items-center justify-between">
            <div>
              <div className="font-bold">{s.order}. {s.account.firstName} {s.account.lastName}</div>
              <div className="text-xs text-ink-muted">استهلاك اليوم: {s.usedToday}</div>
            </div>
            <div>{(rotationState as any)[s.state]?.icon} {(rotationState as any)[s.state]?.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
