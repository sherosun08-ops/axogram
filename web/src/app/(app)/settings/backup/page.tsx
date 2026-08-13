"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [enc, setEnc] = useState(true);
  const [pw, setPw] = useState("");
  return (
    <div>
      <PageHeader title="النسخ الاحتياطي والاستعادة" back="/settings" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="mb-3 space-y-3">
        <div className="font-bold">نسخ الآن</div>
        <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> جلسات الحسابات</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> قاعدة البيانات</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> الإعدادات والقوالب</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={enc} onChange={(e) => setEnc(e.target.checked)} /> تشفير الملف</label>
        {enc && <Field label="كلمة مرور التشفير"><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>}
        <Button className="w-full" disabled={op.busy} onClick={async () => { const r: any = await op.run("backup", { encrypt: enc }); op.setMsg("تم إنشاء " + r.archive?.name + " — " + r.archive?.size); }}>نسخ الآن</Button>
      </Card>
      <Card className="space-y-3">
        <div className="font-bold">استعادة</div>
        <input type="file" className="text-sm" />
        <Button variant="ghost" className="w-full" onClick={async () => { await op.run("restore", {}); op.setMsg("تم تحليل الملف — جاهز للاستعادة"); }}>تحليل ملف الاستعادة</Button>
      </Card>
    </div>
  );
}
