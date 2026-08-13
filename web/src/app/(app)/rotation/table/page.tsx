"use client";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { rotationState } from "@/lib/labels";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const { data, loading, reload } = useApi<any>("/api/rotation");
  const op = useOp();
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="جدول الدورة الحالي" back="/rotation" />
      <Feedback err={op.err} msg={op.msg} />
      <div className="space-y-2">
        {(data?.slots || []).map((s: any) => (
          <Card key={s.id} className="flex items-center justify-between gap-3">
            <div>
              <div className="font-bold">{s.order}. {s.account.firstName} {s.account.lastName}</div>
              <div className="text-xs text-ink-muted">استهلاك اليوم: {s.usedToday} · حد الإضافة {s.account.dailyAddLimit}</div>
            </div>
            <div className="flex items-center gap-2">
              <span>{(rotationState as any)[s.state]?.icon} {(rotationState as any)[s.state]?.label}</span>
              {s.state !== "active" && <Button variant="ghost" onClick={async () => { await op.run("switch_account", { toAccountId: s.accountId }); reload(); op.setMsg("تم التبديل"); }}>تفعيل</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
