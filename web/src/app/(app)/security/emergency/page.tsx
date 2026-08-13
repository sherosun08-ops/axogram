"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Banner } from "@/components/ui";
import { DangerConfirm, Feedback, useOp } from "@/components/prod";
import { useApi } from "@/components/data";

export default function Page() {
  const { data } = useApi<any>("/api/settings");
  const op = useOp();
  const [open, setOpen] = useState("");
  const locked = data?.settings?.emergency_lock === "1";
  async function go(kind: string) {
    const r: any = await op.run("emergency", { kind });
    setOpen("");
    op.setMsg(r.message);
    if (kind === "lock" || kind === "unlock") location.reload();
  }
  return (
    <div>
      <PageHeader title="الاستجابة للطوارئ" back="/security" />
      {locked && <Banner tone="danger">النظام مقفل طوارئياً الآن</Banner>}
      <Feedback err={op.err} msg={op.msg} />
      <div className="space-y-2">
        <Card><div className="font-bold">إيقاف جميع العمليات</div><Button className="mt-2" onClick={() => go("stop")}>إيقاف الآن</Button></Card>
        <Card><div className="font-bold text-danger">قفل النظام</div><Button className="mt-2" variant="danger" onClick={() => setOpen("lock")}>قفل</Button></Card>
        <Card><div className="font-bold">فك القفل</div><Button className="mt-2" onClick={() => go("unlock")}>فك القفل</Button></Card>
        <Card><div className="font-bold">حذف طارئ للجلسات</div><Button className="mt-2" variant="danger" onClick={() => setOpen("wipe")}>حذف</Button></Card>
      </div>
      <DangerConfirm open={open === "lock"} title="قفل النظام؟" word="قفل" onClose={() => setOpen("")} onOk={() => go("lock")}>سيُحجب كل إجراء تشغيلي حتى الفك.</DangerConfirm>
      <DangerConfirm open={open === "wipe"} title="حذف طارئ للجلسات؟" word="حذف" onClose={() => setOpen("")} onOk={() => go("wipe_sessions")}>ستُأرشف الجلسات وتُزال من المسار الحي.</DangerConfirm>
    </div>
  );
}
