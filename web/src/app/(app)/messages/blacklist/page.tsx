"use client";
import { useState } from "react";
import { PageHeader, Card, Input, Button, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
export default function Page() {
  const { data, loading, reload } = useApi<{ items: any[] }>("/api/blacklist");
  const [value, setValue] = useState("");
  if (loading) return <LoadingGrid />;
  const items = (data?.items || []).filter((i) => i.scope === "dm" || i.kind === "word");
  return (
    <div>
      <PageHeader title="سوداء الرسائل" back="/messages" />
      <div className="mb-3 flex gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="مستخدم أو كلمة" />
        <Button onClick={async () => { await api("/api/blacklist", { method: "POST", body: JSON.stringify({ value, scope: "dm", kind: value.startsWith("@") ? "user" : "word" }) }); setValue(""); reload(); }}>إضافة</Button>
      </div>
      {items.map((i) => (
        <Card key={i.id} className="mb-2 flex justify-between">
          <span>{i.value}</span>
          <Button variant="ghost" onClick={async () => { await api("/api/blacklist", { method: "DELETE", body: JSON.stringify({ id: i.id }) }); reload(); }}>حذف</Button>
        </Card>
      ))}
      {items.length === 0 && <Empty title="فارغة" />}
    </div>
  );
}
