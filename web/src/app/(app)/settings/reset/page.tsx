"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Banner } from "@/components/ui";
import { DangerConfirm, Feedback, useOp } from "@/components/prod";
import { api } from "@/lib/api-client";

export default function Page() {
  const op = useOp();
  const [open, setOpen] = useState(false);
  async function resetAll() {
    await api("/api/settings", { method: "PATCH", body: JSON.stringify({
      daily_add_limit: "20", daily_gather_limit: "500", daily_dm_limit: "30", daily_campaign_limit: "25",
      delay_min: "60", delay_max: "120", security_level: "balanced", concurrency: "3",
    }) });
    setOpen(false);
    op.setMsg("تمت إعادة كل الإعدادات للافتراضي — الحسابات والبروكسي وAPI لم تُمس");
  }
  return (
    <div>
      <PageHeader title="إعادة الافتراضي" back="/settings" />
      <Feedback msg={op.msg} />
      <Banner tone="info">يُعاد: الحدود والإشعارات والأمان والأداء. يبقى: الحسابات والبروكسي ومفاتيح API والسجلات.</Banner>
      <Card>
        <Button variant="danger" className="w-full" onClick={() => setOpen(true)}>إعادة كل الإعدادات</Button>
      </Card>
      <DangerConfirm open={open} title="إعادة كل الإعدادات؟" word="إعادة" onClose={() => setOpen(false)} onOk={resetAll}>
        ستُمحى التخصيصات الحالية للإعدادات.
      </DangerConfirm>
    </div>
  );
}
