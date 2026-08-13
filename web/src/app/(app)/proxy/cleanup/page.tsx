"use client";
import { useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi } from "@/components/data";
import { api } from "@/lib/api-client";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const { data, reload } = useApi<{ proxies: any[] }>("/api/proxies");
  const op = useOp();
  const [keepAssigned, setKeep] = useState(true);
  const dead = (data?.proxies || []).filter((p) => p.status === "dead" && (!keepAssigned || !p.accounts?.length));
  return (
    <div>
      <PageHeader title="إزالة غير النشطة" back="/proxy" />
      <Feedback msg={op.msg} />
      <Card className="mb-3">
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={keepAssigned} onChange={(e) => setKeep(e.target.checked)} /> لا تحذف المعيَّنة</label>
        <div className="mt-2 font-bold">{dead.length} مرشّح للحذف</div>
      </Card>
      <Button variant="danger" className="w-full" disabled={!dead.length} onClick={async () => {
        await api("/api/proxies", { method: "DELETE", body: JSON.stringify({ ids: dead.map((p) => p.id) }) });
        reload();
        op.setMsg(`حُذف ${dead.length} بروكسي`);
      }}>حذف غير النشطة</Button>
    </div>
  );
}
