"use client";
import { useState } from "react";
import { PageHeader, Card, Input, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
export default function Dir() {
  const { data, loading, reload } = useApi<{groups:any[]}>("/api/directory");
  const [title,setTitle]=useState("");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="دليل القروبات" back="/campaigns" />
      <div className="mb-3 flex gap-2">
        <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="اسم قروب جديد" />
        <Button onClick={async()=>{await api("/api/directory",{method:"POST",body:JSON.stringify({title})}); setTitle(""); reload();}}>إضافة</Button>
      </div>
      <div className="space-y-2">
        {(data?.groups||[]).map((g:any)=>(
          <Card key={g.id}>
            <div className="font-bold">{g.title}</div>
            <div className="text-sm text-ink-muted">{g.username || g.inviteLink} · {g.members} عضو · {g.type}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
