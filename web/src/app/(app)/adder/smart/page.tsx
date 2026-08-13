"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Banner } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [src, setSrc] = useState("");
  const [dst, setDst] = useState("");
  return (
    <div>
      <PageHeader title="إضافة ذكية" back="/adder" subtitle="تجميع فوري ثم إضافة في عملية مرحلية واحدة" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="قروب المصدر"><Input value={src} onChange={(e) => setSrc(e.target.value)} /></Field>
        <Field label="قروب الهدف"><Input value={dst} onChange={(e) => setDst(e.target.value)} /></Field>
        <Banner tone="info">المرحلة 1: تجميع · المرحلة 2: تنقية · المرحلة 3: إضافة</Banner>
        <Button className="w-full" disabled={!src || !dst || op.busy} onClick={async () => {
          const r: any = await op.run("start_add", { target: dst, source: src, total: 300, title: "إضافة ذكية مرحلية" });
          router.push(`/reports/live/${r.job.id}`);
        }}>بدء</Button>
      </Card>
    </div>
  );
}
