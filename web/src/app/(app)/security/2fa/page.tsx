"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Button } from "@/components/ui";
import { AccountSelect, Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [accountId, setAccountId] = useState("");
  const [pw, setPw] = useState("");
  return (
    <div>
      <PageHeader title="إدارة التحقق بخطوتين" back="/security" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="space-y-3">
        <AccountSelect value={accountId} onChange={setAccountId} />
        <Field label="كلمة المرور الجديدة"><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
        <Button className="w-full" disabled={!accountId || pw.length < 8 || op.busy} onClick={async () => {
          await op.run("set_2fa", { accountId, password: pw });
          op.setMsg("تم تحديث 2FA");
        }}>تحديث / تفعيل</Button>
      </Card>
    </div>
  );
}
