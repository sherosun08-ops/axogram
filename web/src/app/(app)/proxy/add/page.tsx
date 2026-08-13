"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Select } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function AddProxy() {
  const router = useRouter();
  const [form,setForm]=useState({host:"",port:"1080",type:"socks5",username:"",password:"",country:""});
  const [err,setErr]=useState("");
  async function save() {
    try {
      await api("/api/proxies",{method:"POST",body:JSON.stringify({...form,port:Number(form.port)})});
      router.push("/proxy/list");
    } catch(e){ setErr((e as Error).message); }
  }
  return (
    <div>
      <PageHeader title="إضافة بروكسي" back="/proxy" />
      <Card className="space-y-3">
        {err && <div className="text-sm text-danger">{err}</div>}
        <Field label="العنوان"><Input value={form.host} onChange={e=>setForm({...form,host:e.target.value})} /></Field>
        <Field label="المنفذ"><Input value={form.port} onChange={e=>setForm({...form,port:e.target.value})} /></Field>
        <Field label="النوع">
          <Select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            <option value="socks5">SOCKS5</option>
            <option value="socks4">SOCKS4</option>
            <option value="http">HTTP</option>
            <option value="mtproto">MTProto</option>
          </Select>
        </Field>
        <Field label="اسم المستخدم"><Input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} /></Field>
        <Field label="كلمة المرور"><Input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></Field>
        <Field label="الدولة"><Input value={form.country} onChange={e=>setForm({...form,country:e.target.value})} /></Field>
        <Button className="w-full" onClick={save}>اختبار ثم حفظ</Button>
      </Card>
    </div>
  );
}
