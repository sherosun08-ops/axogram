"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Banner } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [link, setLink] = useState("");
  const [emoji, setEmoji] = useState("");
  return (
    <div>
      <PageHeader title="تجميع من تفاعلات رسائل" back="/gather" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="رابط الرسالة"><Input value={link} onChange={(e) => setLink(e.target.value)} /></Field>
        <Field label="أنواع الإيموجي (فارغ = الكل)"><Input value={emoji} onChange={(e) => setEmoji(e.target.value)} /></Field>
        <Banner tone="warning">الرسائل القديمة جداً قد تفقد قائمة المتفاعلين</Banner>
        <Button className="w-full" disabled={!link || op.busy} onClick={async () => {
          const r: any = await op.run("start_gather", { link, emoji, type: "reactions", limit: 800 });
          router.push(`/reports/live/${r.job.id}`);
        }}>بدء الاستخراج</Button>
      </Card>
    </div>
  );
}
