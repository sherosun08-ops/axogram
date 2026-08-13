"use client";
import { useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";
export default function Page() {
  const op = useOp();
  const [tables, setTables] = useState(["jobs"]);
  return (
    <div>
      <PageHeader title="تصدير التقارير والجدولة" back="/reports" />
      <Feedback msg={op.msg} err={op.err} />
      <Card className="space-y-3">
        {["jobs", "accounts", "proxies"].map((t) => (
          <label key={t} className="flex gap-2"><input type="checkbox" checked={tables.includes(t)} onChange={() => setTables((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t])} /> {t}</label>
        ))}
        <Button className="w-full" onClick={async () => {
          const r: any = await op.run("export_csv", { tables });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([JSON.stringify(r.rows, null, 2)]));
          a.download = r.filename;
          a.click();
          op.setMsg("تم التصدير");
        }}>تصدير</Button>
      </Card>
    </div>
  );
}
