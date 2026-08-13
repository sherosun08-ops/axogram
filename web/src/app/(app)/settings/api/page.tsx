"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Button, Banner } from "@/components/ui";
import { useApi } from "@/components/data";
import { api } from "@/lib/api-client";
export default function ApiKeys() {
  const { data, reload } = useApi<any>("/api/settings");
  const [id,setId]=useState(""); const [hash,setHash]=useState("");
  const [msg,setMsg]=useState(""); const [err,setErr]=useState("");
  const s = data?.settings||{};
  async function save() {
    setErr("");
    if(!/^\d+$/.test(id)) return setErr("API ID أرقام فقط");
    if(hash.length!==32) return setErr("API Hash يجب أن يكون 32 حرفاً");
    await api("/api/settings",{method:"PATCH",body:JSON.stringify({api_id:id,api_hash:hash,api_tested:"1"})});
    setMsg("تم حفظ مفاتيح API"); reload();
  }
  return (
    <div>
      <PageHeader title="مفاتيح API تيليجرام" back="/settings" />
      <Banner tone="warning">هذا الإعداد إلزامي — بدونه لا يعمل أي شيء</Banner>
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="mb-3">
        <div className="text-sm">API ID الحالي: {s.api_id? "•••••••••••":"غير مضبوط"}</div>
        <div className="text-sm">API Hash: {s.api_hash? "••••••••••••••••":"غير مضبوط"}</div>
      </Card>
      <Card className="space-y-3">
        <Field label="API ID الجديد" error={err}><Input value={id} onChange={e=>setId(e.target.value)} /></Field>
        <Field label="API Hash الجديد"><Input value={hash} onChange={e=>setHash(e.target.value)} /></Field>
        <Button className="w-full" onClick={save}>حفظ المفاتيح الجديدة</Button>
        <div className="rounded-xl bg-slate-50 p-3 text-xs">1 افتح my.telegram.org · 2 سجّل دخول · 3 API development tools · 4 أنشئ تطبيقاً · 5 انسخ المفاتيح</div>
      </Card>
    </div>
  );
}
