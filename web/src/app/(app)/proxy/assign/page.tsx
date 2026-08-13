"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Radio, Banner } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [mode, setMode] = useState("smart");
  return (
    <div>
      <PageHeader title="تعيين البروكسيهات للحسابات" back="/proxy" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="space-y-3">
        <Radio name="m" value="smart" checked={mode === "smart"} onChange={setMode} label="تلقائي ذكي" hint="يوزّع الحيّ على الحسابات النشطة" />
        <Radio name="m" value="rotate" checked={mode === "rotate"} onChange={setMode} label="تدوير دوري" />
        <Banner tone="info">التعيين الذكي يوزّع حسب التوفر والكمون</Banner>
        <Button className="w-full" disabled={op.busy} onClick={async () => {
          const r: any = await op.run("assign_proxies", { mode });
          op.setMsg(`تم تعيين ${r.assigned} حساباً`);
        }}>تطبيق التعيين</Button>
      </Card>
    </div>
  );
}
