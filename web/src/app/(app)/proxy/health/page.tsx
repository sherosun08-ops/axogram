"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Button, Radio } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [scope, setScope] = useState("all");
  return (
    <div>
      <PageHeader title="فحص صحة البروكسي" back="/proxy" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Radio name="s" value="all" checked={scope === "all"} onChange={setScope} label="الكل" />
        <Radio name="s" value="dead" checked={scope === "dead"} onChange={setScope} label="الميتة فقط" />
        <Radio name="s" value="unknown" checked={scope === "unknown"} onChange={setScope} label="غير المفحوصة" />
        <Button className="w-full" disabled={op.busy} onClick={async () => {
          const r: any = await op.run("check_all_proxies", { scope });
          router.push(`/reports/live/${r.job.id}`);
        }}>بدء الفحص</Button>
      </Card>
    </div>
  );
}
