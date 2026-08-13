"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [raw, setRaw] = useState("");
  const [target, setTarget] = useState("");
  return (
    <div>
      <PageHeader title="متعدد المصادر" back="/adder" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="ملفات أو روابط مصادر — سطر لكل مصدر"><Textarea value={raw} onChange={(e) => setRaw(e.target.value)} /></Field>
        <Field label="القروب الهدف"><Input value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
        <Button className="w-full" disabled={!raw || !target || op.busy} onClick={async () => {
          const r: any = await op.run("start_add", { target, raw, total: 500, title: "إضافة متعددة المصادر" });
          router.push(`/reports/live/${r.job.id}`);
        }}>بدء</Button>
      </Card>
    </div>
  );
}
