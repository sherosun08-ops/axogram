"use client";
import { useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [tables, setTables] = useState<string[]>(["accounts", "proxies"]);
  function tog(t: string) {
    setTables((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  }
  return (
    <div>
      <PageHeader title="تصدير بيانات CSV" back="/settings" subtitle="تصدير البيانات فقط — بدون ملفات الجلسات" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="space-y-3">
        {[["accounts", "الحسابات"], ["proxies", "البروكسيهات"], ["jobs", "العمليات"]].map(([id, l]) => (
          <label key={id} className="flex gap-2"><input type="checkbox" checked={tables.includes(id)} onChange={() => tog(id)} /> {l}</label>
        ))}
        <Button className="w-full" disabled={!tables.length || op.busy} onClick={async () => {
          const r: any = await op.run("export_csv", { tables });
          const blob = new Blob([JSON.stringify(r.rows, null, 2)], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = r.filename;
          a.click();
          op.setMsg("اكتمل التصدير — تم تنزيل الملف");
        }}>تصدير</Button>
      </Card>
    </div>
  );
}
