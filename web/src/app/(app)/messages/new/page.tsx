"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function NewDm() {
  const router = useRouter();
  const [name,setName]=useState(""); const [message,setMessage]=useState(""); const [targets,setTargets]=useState("100");
  async function save() {
    const r = await api<any>("/api/campaigns",{method:"POST",body:JSON.stringify({kind:"dm",name,message,targetsCount:Number(targets),status:"draft"})});
    router.push("/messages/list");
  }
  return (
    <div>
      <PageHeader title="إنشاء حملة DM" back="/messages" />
      <Card className="space-y-3">
        <Field label="اسم الحملة"><Input value={name} onChange={e=>setName(e.target.value)} /></Field>
        <Field label="الرسالة" hint="{{name}} يُستبدل باسم المستلم"><Textarea value={message} onChange={e=>setMessage(e.target.value)} /></Field>
        <Field label="عدد المستهدفين"><Input type="number" value={targets} onChange={e=>setTargets(e.target.value)} /></Field>
        <Button className="w-full" disabled={!name||!message} onClick={save}>حفظ كمسودة</Button>
      </Card>
    </div>
  );
}
