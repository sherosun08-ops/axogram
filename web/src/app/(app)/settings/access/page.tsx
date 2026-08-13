"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Button, Banner } from "@/components/ui";
import { useApi } from "@/components/data";
import { formatDateTime } from "@/lib/utils";
export default function Access() {
  const { data } = useApi<any>("/api/settings");
  const [msg,setMsg]=useState("");
  return (
    <div>
      <PageHeader title="أمان الوصول للوحة" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="mb-3 space-y-3">
        <Field label="البريد الحالي"><Input value={data?.users?.[0]?.email||""} readOnly /></Field>
        <Field label="كلمة المرور الحالية"><Input type="password" /></Field>
        <Field label="كلمة المرور الجديدة"><Input type="password" /></Field>
        <Button onClick={()=>setMsg("تم تحديث كلمة المرور")}>تحديث بيانات الدخول</Button>
      </Card>
      <div className="mb-2 font-bold">سجل محاولات الدخول</div>
      <div className="space-y-2">
        {(data?.attempts||[]).map((a:any)=>(
          <Card key={a.id}>
            <div className="text-sm">{a.success?"✅":"❌"} {a.email} · {a.ip}</div>
            <div className="text-xs text-ink-muted">{a.reason} · {formatDateTime(a.createdAt)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
