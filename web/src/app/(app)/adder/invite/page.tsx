"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Radio, Banner } from "@/components/ui";
import { Feedback, FileSelect, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [target, setTarget] = useState("");
  const [mode, setMode] = useState("current");
  const [fileId, setFileId] = useState("");
  return (
    <div>
      <PageHeader title="إرسال رابط الدعوة" back="/adder" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="القروب الهدف"><Input value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
        <Radio name="m" value="current" checked={mode === "current"} onChange={setMode} label="جلب الرابط الحالي" />
        <Radio name="m" value="new" checked={mode === "new"} onChange={setMode} label="إنشاء رابط جديد" />
        <FileSelect value={fileId} onChange={setFileId} />
        <Banner tone="info">يُرسل الرابط عبر رسالة خاصة للمستهدفين</Banner>
        <Button className="w-full" disabled={!target || op.busy} onClick={async () => {
          const r: any = await op.run("start_add", { target, method: "invite", fileId, total: 120, title: "إرسال روابط دعوة" });
          router.push(`/reports/live/${r.job.id}`);
        }}>بدء الإرسال</Button>
      </Card>
    </div>
  );
}
