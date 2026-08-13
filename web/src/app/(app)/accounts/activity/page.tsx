"use client";
import { useState } from "react";
import { PageHeader, Card, Segment, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatDateTime } from "@/lib/utils";

export default function Activity() {
  const [tab,setTab]=useState("");
  const { data, loading } = useApi<{logs:any[]}>(tab?`/api/logs?type=${tab}`:"/api/logs");
  if (loading) return <LoadingGrid />;
  const logs = data?.logs || [];
  return (
    <div>
      <PageHeader title="سجل النشاط" back="/accounts" />
      <Segment value={tab} onChange={setTab} options={[{id:"",label:"الكل"},{id:"gather",label:"تجميع"},{id:"add",label:"إضافة"},{id:"dm",label:"رسائل"},{id:"error",label:"أخطاء"}]} />
      <div className="mt-4 space-y-2">
        {logs.map((l:any)=>(
          <Card key={l.id}>
            <div className="font-semibold">{l.level==="error"?"❌":l.level==="warning"?"⚠️":"🟢"} {l.type} · {l.account? l.account.firstName: "النظام"}</div>
            <div className="text-sm">{l.message}</div>
            <div className="text-xs text-ink-muted">{formatDateTime(l.createdAt)}</div>
          </Card>
        ))}
        {logs.length===0 && <Empty icon="📋" title="لا نشاط مسجّل بعد" />}
      </div>
    </div>
  );
}
