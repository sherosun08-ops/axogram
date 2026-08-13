"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Modal, Progress } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const { data, loading, reload } = useApi<any>("/api/rotation");
  const op = useOp();
  const [edit, setEdit] = useState<any>(null);
  const [limit, setLimit] = useState("");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="الاستهلاك والحدود اليومية" back="/rotation" />
      <Feedback err={op.err} msg={op.msg} />
      <div className="space-y-2">
        {(data?.accounts || []).filter((a: any) => a.inRotation !== false).map((a: any) => {
          const pct = a.dailyAddLimit ? Math.min(100, (a.usedAdd / a.dailyAddLimit) * 100) : 0;
          return (
            <Card key={a.id}>
              <div className="flex justify-between text-sm font-semibold">{a.firstName} {a.lastName} <span>{a.usedAdd}/{a.dailyAddLimit}</span></div>
              <Progress value={pct} className="mt-2" />
              <Button variant="ghost" className="mt-2" onClick={() => { setEdit(a); setLimit(String(a.dailyAddLimit)); }}>تعديل الحد</Button>
            </Card>
          );
        })}
      </div>
      <Modal open={!!edit} title={`تعديل حد ${edit?.firstName || ""}`} onClose={() => setEdit(null)} footer={
        <Button onClick={async () => { await op.run("extend_limit", { accountId: edit.id, limit: Number(limit) }); setEdit(null); reload(); op.setMsg("تم تعديل الحد"); }}>حفظ</Button>
      }>
        <Field label="الحد اليومي للإضافة"><Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} /></Field>
      </Modal>
    </div>
  );
}
