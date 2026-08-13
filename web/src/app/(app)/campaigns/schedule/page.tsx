"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Button } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";
export default function Page() {
  const op = useOp();
  const [title, setTitle] = useState("");
  const [at, setAt] = useState("21:00");
  return (
    <div>
      <PageHeader title="جدولة الحملات" back="/campaigns" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="space-y-3">
        <Field label="عنوان الجدول"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="الوقت"><Input value={at} onChange={(e) => setAt(e.target.value)} /></Field>
        <label className="flex gap-2 text-sm"><input type="checkbox" /> تكرار أسبوعي</label>
        <Button disabled={!title} onClick={async () => { await op.run("create_schedule", { kind: "campaign", title, at, repeat: "weekly" }); op.setMsg("تمت الجدولة"); }}>جدولة</Button>
      </Card>
    </div>
  );
}
