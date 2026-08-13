"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Banner } from "@/components/ui";
import { AccountSelect, Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [accountId, setAccountId] = useState("");
  const [verdict, setVerdict] = useState("");
  return (
    <div>
      <PageHeader title="فحص SpamBot" back="/security" subtitle="يسأل عن حالة القيد لحساب محدد" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <AccountSelect value={accountId} onChange={setAccountId} label="الحساب" />
        <Button className="w-full" disabled={!accountId || op.busy} onClick={async () => {
          const r: any = await op.run("spambot", { accountId });
          setVerdict(r.verdict);
        }}>فحص</Button>
        {verdict && <Banner tone={verdict.includes("لا قيود") ? "success" : "warning"}>{verdict}</Banner>}
      </Card>
    </div>
  );
}
