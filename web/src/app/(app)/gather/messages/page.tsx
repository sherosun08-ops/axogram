"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button } from "@/components/ui";
import { AccountSelect, Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [link, setLink] = useState("");
  const [n, setN] = useState("2000");
  const [accountId, setAccountId] = useState("");
  return (
    <div>
      <PageHeader title="تجميع من سجل الرسائل" back="/gather" subtitle="من تكلّم في القروب — بديل عندما تكون القائمة مخفية" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="رابط القروب"><Input value={link} onChange={(e) => setLink(e.target.value)} /></Field>
        <Field label="عدد الرسائل للمسح"><Input type="number" value={n} onChange={(e) => setN(e.target.value)} /></Field>
        <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد البوتات</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد المحذوفين</label>
        <AccountSelect value={accountId} onChange={setAccountId} />
        <Button className="w-full" disabled={!link || op.busy} onClick={async () => {
          const r: any = await op.run("start_gather", { link, accountId, limit: Number(n), type: "messages" });
          router.push(`/reports/live/${r.job.id}`);
        }}>بدء المسح</Button>
      </Card>
    </div>
  );
}
