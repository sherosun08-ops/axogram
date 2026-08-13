"use client";
import { useState } from "react";
import { PageHeader, Card, Input, Button, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
export default function BL() {
  const { data, loading, reload } = useApi<{items:any[]}>("/api/blacklist");
  const [value,setValue]=useState("");
  if (loading) return <LoadingGrid />;
  const items = (data?.items||[]).filter((i:any)=>i.scope!=="dm");
  return (
    <div>
      <PageHeader title="القائمة السوداء — الإضافة" back="/adder" />
      <div className="mb-3 flex gap-2">
        <Input value={value} onChange={e=>setValue(e.target.value)} placeholder="@user أو رقم" />
        <Button onClick={async()=>{await api("/api/blacklist",{method:"POST",body:JSON.stringify({value,scope:"add"})}); setValue(""); reload();}}>إضافة</Button>
      </div>
      <div className="space-y-2">
        {items.map((i:any)=>(
          <Card key={i.id} className="flex justify-between">
            <div><div className="font-bold">{i.value}</div><div className="text-xs text-ink-muted">{i.reason||"بدون سبب"} · {i.scope}</div></div>
            <Button variant="ghost" onClick={async()=>{await api("/api/blacklist",{method:"DELETE",body:JSON.stringify({id:i.id})}); reload();}}>حذف</Button>
          </Card>
        ))}
        {items.length===0 && <Empty title="القائمة فارغة" />}
      </div>
    </div>
  );
}
