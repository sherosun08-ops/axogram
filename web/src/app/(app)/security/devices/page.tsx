"use client";
import { useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { AccountSelect, Feedback, useOp } from "@/components/prod";
import { formatDateTime } from "@/lib/utils";

export default function Page() {
  const op = useOp();
  const [accountId, setAccountId] = useState("");
  const [devices, setDevices] = useState<any[]>([]);
  return (
    <div>
      <PageHeader title="الأجهزة المتصلة" back="/security" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="mb-3 space-y-3">
        <AccountSelect value={accountId} onChange={setAccountId} />
        <Button disabled={!accountId || op.busy} onClick={async () => setDevices((await op.run("list_devices", { accountId }) as any).devices)}>عرض الأجهزة</Button>
      </Card>
      <div className="space-y-2">
        {devices.map((d) => (
          <Card key={d.id} className="flex justify-between">
            <div>
              <div className="font-bold">{d.name} {d.current && "· الجلسة الحالية"}</div>
              <div className="text-xs text-ink-muted">{d.ip} · {formatDateTime(d.last)}</div>
            </div>
            {!d.current && <Button variant="danger" onClick={async () => { await op.run("terminate_device", { accountId, name: d.name }); op.setMsg("أُنهي الجهاز"); }}>إنهاء</Button>}
          </Card>
        ))}
      </div>
    </div>
  );
}
