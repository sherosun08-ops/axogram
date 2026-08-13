"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui";
import { AccountSelect, Feedback, FileSelect, useOp } from "@/components/prod";
import { api } from "@/lib/api-client";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("مرحباً {{name}}");
  const [targets, setTargets] = useState("200");
  const [fileId, setFileId] = useState("");
  const [accountId, setAccountId] = useState("");
  return (
    <div>
      <PageHeader title="إنشاء حملة DM" back="/messages" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="اسم الحملة"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="الرسالة" hint="{{name}} يُستبدل باسم المستلم"><Textarea value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
        <FileSelect value={fileId} onChange={setFileId} />
        <Field label="عدد المستهدفين"><Input type="number" value={targets} onChange={(e) => setTargets(e.target.value)} /></Field>
        <AccountSelect value={accountId} onChange={setAccountId} filter={(a) => a.allowDm !== false} />
        <Button className="w-full" disabled={!name || !message} onClick={async () => {
          await api("/api/campaigns", { method: "POST", body: JSON.stringify({ kind: "dm", name, message, targetsCount: Number(targets), status: "draft" }) });
          router.push("/messages/list");
        }}>حفظ كمسودة</Button>
        <Button className="w-full" variant="accent" disabled={!name || !message || op.busy} onClick={async () => {
          await api("/api/campaigns", { method: "POST", body: JSON.stringify({ kind: "dm", name, message, targetsCount: Number(targets), status: "running" }) });
          const r: any = await op.run("start_add", { title: `حملة DM: ${name}`, total: Number(targets), typeHint: "dm" });
          router.push(`/reports/live/${r.job.id}`);
        }}>حفظ وتشغيل</Button>
      </Card>
    </div>
  );
}
