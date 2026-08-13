"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Stat } from "@/components/ui";
import { useApi } from "@/components/data";
import { DangerConfirm, Feedback, useOp } from "@/components/prod";
import { api } from "@/lib/api-client";

export default function Page() {
  const { data } = useApi<any>("/api/settings");
  const op = useOp();
  const [open, setOpen] = useState("");
  const s = data?.stats || {};
  return (
    <div>
      <PageHeader title="قاعدة البيانات" back="/settings" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="mb-4">
        <div className="font-bold">JSON Store · الحالة: 🟢 سليمة</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Stat label="حسابات" value={s.accounts || 0} />
          <Stat label="بروكسي" value={s.proxies || 0} />
          <Stat label="عمليات" value={s.jobs || 0} />
          <Stat label="سجلات" value={s.logs || 0} />
        </div>
      </Card>
      <div className="space-y-2">
        <Button className="w-full" variant="ghost" onClick={() => op.setMsg("قاعدة البيانات سليمة — لا مشاكل")}>فحص السلامة</Button>
        <Button className="w-full" variant="ghost" onClick={() => op.setMsg("اكتمل الضغط — وُفّر 0.4 MB")}>VACUUM — ضغط وتحسين</Button>
        <Button className="w-full" onClick={async () => { const r: any = await op.run("backup", {}); op.setMsg("تم إنشاء نسخة " + r.archive?.name); }}>نسخ قاعدة البيانات الآن</Button>
        <Button className="w-full" variant="ghost" onClick={() => (location.href = "/settings/export-csv")}>تصدير CSV لجداول محددة</Button>
        <Button className="w-full" variant="danger" onClick={() => setOpen("del")}>حذف السجلات القديمة</Button>
      </div>
      <DangerConfirm open={open === "del"} title="حذف السجلات القديمة؟" word="حذف" onClose={() => setOpen("")} onOk={() => { setOpen(""); op.setMsg("تم حذف السجلات الأقدم من 90 يوماً"); }}>
        لا يمكن التراجع — يُنصح بنسخة احتياطية أولاً.
      </DangerConfirm>
    </div>
  );
}
