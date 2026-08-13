"use client";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const { data, loading, reload } = useApi<any>("/api/rotation");
  const op = useOp();
  if (loading) return <LoadingGrid />;
  const active = (data?.slots || []).find((s: any) => s.state === "active");
  return (
    <div>
      <PageHeader title="المراقب الحي" back="/rotation" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="mb-3">
        <div className="text-sm text-ink-muted">الحساب النشط الآن</div>
        <div className="text-xl font-bold text-navy">{active ? `${active.account.firstName} ${active.account.lastName}` : "—"}</div>
        <div className="text-sm">المستخدم اليوم: {active?.usedToday || 0}</div>
      </Card>
      <div className="space-y-2">
        {(data?.slots || []).map((s: any) => (
          <div key={s.id} className="flex items-center justify-between rounded-xl border bg-white p-3 text-sm">
            <span>{s.order}. {s.account.firstName} · {s.state}</span>
            {s.state !== "active" && <Button variant="ghost" onClick={async () => { await op.run("switch_account", { toAccountId: s.accountId, reason: "مراقب حي" }); reload(); }}>تبديل إليه</Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
