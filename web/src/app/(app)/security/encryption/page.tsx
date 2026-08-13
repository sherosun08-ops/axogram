"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Banner } from "@/components/ui";
import { Feedback, SettingsForm, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [key, setKey] = useState("");
  return (
    <div>
      <PageHeader title="تشفير الجلسات والبيانات" back="/security" />
      <Feedback msg={op.msg} />
      <Banner tone="warning">تفعيل التشفير يعرض مفتاحاً مرة واحدة — احفظه خارج النظام</Banner>
      <SettingsForm back="/security" title="enc" success="تم تحديث إعداد التشفير" keys={[
        { key: "encrypt_sessions", label: "تشفير ملفات الجلسات", type: "toggle" },
      ]} />
      <Card className="mt-4 space-y-2">
        <Button onClick={() => { setKey("TC-" + Math.random().toString(36).slice(2, 10).toUpperCase() + "-KEY"); op.setMsg("احفظ المفتاح الآن — لن يُعرض مرة أخرى"); }}>توليد / عرض المفتاح</Button>
        {key && <div className="rounded-xl bg-navy p-3 font-mono text-white">{key}</div>}
      </Card>
    </div>
  );
}
