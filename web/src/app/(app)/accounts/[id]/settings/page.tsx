"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader, Card, Field, Input, Button, Radio, Toggle } from "@/components/ui";
import { api } from "@/lib/api-client";
import { useApi } from "@/components/data";

export default function AccSettings() {
  const { id } = useParams<{id:string}>();
  const { data } = useApi<{account:any}>(`/api/accounts/${id}`);
  const [form,setForm]=useState<any>(null);
  const [msg,setMsg]=useState("");
  useEffect(()=>{ if(data?.account) setForm(data.account); },[data]);
  if(!form) return <div className="skeleton h-40" />;
  async function save() {
    await api(`/api/accounts/${id}`,{method:"PATCH",body:JSON.stringify({
      dailyGatherLimit:Number(form.dailyGatherLimit),
      dailyAddLimit:Number(form.dailyAddLimit),
      dailyDmLimit:Number(form.dailyDmLimit),
      dailyCampaignLimit:Number(form.dailyCampaignLimit),
      rotationPriority:form.rotationPriority,
      allowGather:form.allowGather,
      allowAdd:form.allowAdd,
      allowDm:form.allowDm,
      allowCampaign:form.allowCampaign,
      inRotation:form.inRotation,
    })});
    setMsg("تم حفظ إعدادات الحساب");
  }
  return (
    <div>
      <PageHeader title="إعدادات الحساب" back={`/accounts/${id}`} subtitle={`${form.firstName} ${form.lastName||""}`} />
      {msg && <div className="mb-3 rounded-xl bg-success-soft p-3 text-success text-sm">{msg}</div>}
      <Card className="space-y-3">
        <Field label="حد التجميع"><Input type="number" value={form.dailyGatherLimit} onChange={e=>setForm({...form,dailyGatherLimit:e.target.value})} /></Field>
        <Field label="حد الإضافة"><Input type="number" value={form.dailyAddLimit} onChange={e=>setForm({...form,dailyAddLimit:e.target.value})} /></Field>
        <Field label="حد الرسائل DM"><Input type="number" value={form.dailyDmLimit} onChange={e=>setForm({...form,dailyDmLimit:e.target.value})} /></Field>
        <Field label="حد حملات القروبات"><Input type="number" value={form.dailyCampaignLimit} onChange={e=>setForm({...form,dailyCampaignLimit:e.target.value})} /></Field>
        <div className="font-semibold">الأولوية في التدوير</div>
        {[["high","عالية 🔴"],["medium","متوسطة 🟡"],["low","منخفضة 🟢"]].map(([v,l])=>(
          <Radio key={v} name="pr" value={v} checked={form.rotationPriority===v} onChange={val=>setForm({...form,rotationPriority:val})} label={l} />
        ))}
        <Toggle checked={form.allowGather} onChange={v=>setForm({...form,allowGather:v})} label="يُستخدم في التجميع" />
        <Toggle checked={form.allowAdd} onChange={v=>setForm({...form,allowAdd:v})} label="يُستخدم في الإضافة" />
        <Toggle checked={form.allowDm} onChange={v=>setForm({...form,allowDm:v})} label="يُستخدم في رسائل DM" />
        <Toggle checked={form.inRotation} onChange={v=>setForm({...form,inRotation:v})} label="يدخل في نظام التدوير" />
        <Button className="w-full" onClick={save}>حفظ التغييرات</Button>
      </Card>
    </div>
  );
}
