"use client";
import { useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi } from "@/components/data";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const { data } = useApi<{ proxies: any[] }>("/api/proxies");
  const op = useOp();
  const [creds, setCreds] = useState(false);
  return (
    <div>
      <PageHeader title="تصدير البروكسي" back="/proxy" />
      <Feedback msg={op.msg} />
      <Card className="space-y-3">
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={creds} onChange={(e) => setCreds(e.target.checked)} /> تضمين بيانات الدخول</label>
        <Button className="w-full" onClick={() => {
          const lines = (data?.proxies || []).map((p) => creds ? `${p.host}:${p.port}:${p.username || ""}:${p.password || ""}` : `${p.host}:${p.port}`);
          const blob = new Blob([lines.join("\n")], { type: "text/plain" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "proxies.txt";
          a.click();
          op.setMsg("تم التصدير");
        }}>تصدير TXT</Button>
      </Card>
    </div>
  );
}
