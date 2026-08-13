"use client";
import { useState } from "react";
import { PageHeader, Card, Input, Button, Empty, Select } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";

export default function Page() {
  const { data, loading, reload } = useApi<{ items: any[] }>("/api/blacklist");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [kind, setKind] = useState("user");
  if (loading) return <LoadingGrid />;
  const items = (data?.items || []).filter((i) => i.scope !== "dm");
  return (
    <div>
      <PageHeader title="القائمة السوداء — الإضافة" back="/adder" />
      <div className="mb-3 grid gap-2 md:grid-cols-4">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="@user أو رقم" />
        <Select value={kind} onChange={(e) => setKind(e.target.value)}><option value="user">مستخدم</option><option value="group">قروب</option><option value="word">كلمة</option></Select>
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="السبب" />
        <Button onClick={async () => { await api("/api/blacklist", { method: "POST", body: JSON.stringify({ value, kind, reason, scope: "add" }) }); setValue(""); reload(); }}>إضافة</Button>
      </div>
      <div className="space-y-2">
        {items.map((i) => (
          <Card key={i.id} className="flex justify-between">
            <div><div className="font-bold">{i.value}</div><div className="text-xs text-ink-muted">{i.kind} · {i.reason || "بدون سبب"} · {i.scope}</div></div>
            <Button variant="ghost" onClick={async () => { await api("/api/blacklist", { method: "DELETE", body: JSON.stringify({ id: i.id }) }); reload(); }}>حذف</Button>
          </Card>
        ))}
        {items.length === 0 && <Empty title="القائمة فارغة" />}
      </div>
    </div>
  );
}
