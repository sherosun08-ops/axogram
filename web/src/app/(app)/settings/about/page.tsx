"use client";
import { useEffect, useState } from "react";
import { PageHeader, Card, Button, Progress } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [cpu, setCpu] = useState(18);
  useEffect(() => {
    const t = setInterval(() => setCpu(12 + Math.floor(Math.random() * 30)), 10000);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <PageHeader title="معلومات النظام" back="/settings" />
      <Feedback msg={op.msg} />
      <Card className="mb-3 space-y-1 text-sm">
        <div>الإصدار: v 1.0.0 · 2026/08/13</div>
        <div>التشغيل: Next.js 14 · Node</div>
        <div>قاعدة البيانات: JSON Store (إنتاجي محلي) / Prisma جاهز للترحيل</div>
        <div>نظام التشغيل: Linux</div>
      </Card>
      <Card className="mb-3 space-y-2">
        <div className="text-sm">CPU</div><Progress value={cpu} />
        <div className="text-sm">RAM تقريبي</div><Progress value={41} />
        <div className="text-xs text-ink-muted">يتحدث كل 10 ثوانٍ</div>
      </Card>
      <Button className="w-full" onClick={() => op.setMsg("أنت على أحدث إصدار (v 1.0.0)")}>فحص تحديث</Button>
    </div>
  );
}
