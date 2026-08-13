"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Radio, Banner } from "@/components/ui";
import { DangerConfirm, Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [scope, setScope] = useState("all");
  const [open, setOpen] = useState(false);
  return (
    <div>
      <PageHeader title="تصفير العدادات" back="/rotation" />
      <Feedback err={op.err} msg={op.msg} />
      <Banner tone="warning">التصفير يؤثر على قرار التدوير فوراً — لا يُلغى</Banner>
      <Card className="space-y-3">
        <Radio name="s" value="all" checked={scope === "all"} onChange={setScope} label="كل الحسابات" />
        <Radio name="s" value="group" checked={scope === "group"} onChange={setScope} label="مجموعة محددة (الأولى)" />
        <Button variant="danger" className="w-full" onClick={() => setOpen(true)}>تصفير</Button>
      </Card>
      <DangerConfirm open={open} title="تصفير العدادات؟" word="تصفير" onClose={() => setOpen(false)} onOk={async () => {
        const r: any = await op.run("reset_counters", { scope });
        setOpen(false);
        op.setMsg(`تم تصفير عدادات ${r.count} حساب`);
      }}>سيُعاد احتساب الدورة من الصفر.</DangerConfirm>
    </div>
  );
}
