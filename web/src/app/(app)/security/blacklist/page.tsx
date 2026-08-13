"use client";
import { useState } from "react";
import { PageHeader, Card, Input, Button, Empty, Select } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
import { DangerConfirm } from "@/components/prod";

export default function Page() {
  const { data, loading, reload } = useApi<{ items: any[] }>("/api/blacklist");
  const [value, setValue] = useState("");
  const [kind, setKind] = useState("user");
  const [reason, setReason] = useState("");
  const [wipe, setWipe] = useState(false);
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="القائمة السوداء العالمية" back="/security" />
      <div className="mb-3 grid gap-2 md:grid-cols-4">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="قيمة" />
        <Select value={kind} onChange={(e) => setKind(e.target.value)}><option value="user">مستخدم</option><option value="group">قروب</option><option value="word">كلمة</option></Select>
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="السبب" />
        <Button onClick={async () => { await api("/api/blacklist", { method: "POST", body: JSON.stringify({ value, kind, reason, scope: "global" }) }); setValue(""); reload(); }}>إضافة</Button>
      </div>
      <div className="space-y-2">
        {(data?.items || []).map((i) => (
          <Card key={i.id} className="flex justify-between">
            <div><div className="font-bold">{i.value}</div><div className="text-xs text-ink-muted">{i.kind} · {i.reason} · {i.scope}</div></div>
            <Button variant="ghost" onClick={async () => { await api("/api/blacklist", { method: "DELETE", body: JSON.stringify({ id: i.id }) }); reload(); }}>حذف</Button>
          </Card>
        ))}
        {(data?.items || []).length === 0 && <Empty title="فارغة" />}
      </div>
      <Button variant="danger" className="mt-4 w-full" onClick={() => setWipe(true)}>مسح القائمة الكاملة</Button>
      <DangerConfirm open={wipe} title="مسح القائمة الكاملة؟" word="مسح" onClose={() => setWipe(false)} onOk={async () => { await api("/api/blacklist", { method: "DELETE", body: JSON.stringify({ all: true }) }); setWipe(false); reload(); }}>
        لا يمكن التراجع.
      </DangerConfirm>
    </div>
  );
}
