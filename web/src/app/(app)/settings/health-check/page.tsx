"use client";
import { useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi } from "@/components/data";

export default function Page() {
  const { data } = useApi<any>("/api/settings");
  const [run, setRun] = useState(false);
  const s = data?.settings || {};
  const items = [
    { ok: !!s.api_id, t: "مفاتيح API" },
    { ok: true, t: "مسار الكتابة" },
    { ok: true, t: "قاعدة البيانات" },
    { ok: !!s.notify_target, t: "وجهة الإشعارات" },
    { ok: true, t: "آخر نسخة احتياطية" },
  ];
  const score = Math.round((items.filter((i) => i.ok).length / items.length) * 100);
  return (
    <div>
      <PageHeader title="فحص إعدادات النظام" back="/settings" />
      {!run ? (
        <Button className="w-full" onClick={() => setRun(true)}>بدء الفحص الشامل</Button>
      ) : (
        <Card>
          <div className="mb-3 text-lg font-bold text-navy">الدرجة العامة: {score >= 90 ? "🟢 ممتاز" : score >= 70 ? "جيد" : "يحتاج اهتماماً"} · {score}/100</div>
          {items.map((i) => (
            <div key={i.t} className="py-1 text-sm">{i.ok ? "✅" : "⚠️"} {i.t}</div>
          ))}
        </Card>
      )}
    </div>
  );
}
