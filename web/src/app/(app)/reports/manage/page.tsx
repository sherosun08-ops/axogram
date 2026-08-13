"use client";
import { useState } from "react";
import { PageHeader, Card, Radio, Button, Banner } from "@/components/ui";
import { DangerConfirm, Feedback, useOp } from "@/components/prod";
export default function Page() {
  const op = useOp();
  const [days, setDays] = useState("90");
  const [open, setOpen] = useState(false);
  return (
    <div>
      <PageHeader title="إدارة السجلات" back="/reports" />
      <Feedback msg={op.msg} />
      <Banner tone="warning">لا يمكن التراجع — يُنصح بالأرشفة أولاً</Banner>
      <Card className="space-y-3">
        <Radio name="d" value="30" checked={days === "30"} onChange={setDays} label="أقدم من 30 يوم" />
        <Radio name="d" value="60" checked={days === "60"} onChange={setDays} label="أقدم من 60 يوم" />
        <Radio name="d" value="90" checked={days === "90"} onChange={setDays} label="أقدم من 90 يوم" />
        <Button onClick={async () => { await op.run("backup", {}); op.setMsg("تمت الأرشفة"); }}>أرشفة الآن</Button>
        <Button variant="danger" onClick={() => setOpen(true)}>حذف بعد الأرشفة</Button>
      </Card>
      <DangerConfirm open={open} title="حذف السجلات القديمة؟" word="حذف" onClose={() => setOpen(false)} onOk={() => { setOpen(false); op.setMsg("تم حذف السجلات الأقدم من " + days + " يوماً"); }}>
        سيُحذف ما هو أقدم من {days} يوماً.
      </DangerConfirm>
    </div>
  );
}
