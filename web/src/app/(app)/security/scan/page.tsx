"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Button, Radio } from "@/components/ui";
import { AccountSelect, Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [scope, setScope] = useState("all");
  const [accountId, setAccountId] = useState("");
  return (
    <div>
      <PageHeader title="فحص أمان شامل" back="/security" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Radio name="s" value="all" checked={scope === "all"} onChange={setScope} label="كل الحسابات" />
        <Radio name="s" value="one" checked={scope === "one"} onChange={setScope} label="حساب محدد" />
        {scope === "one" && <AccountSelect value={accountId} onChange={setAccountId} />}
        <Button className="w-full" disabled={op.busy} onClick={async () => {
          const r: any = await op.run("security_scan", { scope, accountId });
          router.push(`/reports/live/${r.job.id}`);
        }}>بدء الفحص</Button>
      </Card>
    </div>
  );
}
