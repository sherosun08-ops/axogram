"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Textarea, Button, Radio } from "@/components/ui";
import { api } from "@/lib/api-client";

export default function NewGroup() {
  const router = useRouter();
  const [name,setName]=useState("");
  const [description,setDescription]=useState("");
  const [purpose,setPurpose]=useState("multi");
  const [err,setErr]=useState("");
  async function save() {
    try {
      await api("/api/accounts/groups",{method:"POST",body:JSON.stringify({name,description,purpose})});
      router.push("/accounts/groups");
    } catch(e){ setErr((e as Error).message); }
  }
  return (
    <div>
      <PageHeader title="مجموعة جديدة" back="/accounts/groups" />
      <Card className="space-y-3">
        <Field label="اسم المجموعة" error={err}><Input value={name} onChange={e=>setName(e.target.value)} /></Field>
        <Field label="وصف (اختياري)"><Textarea value={description} onChange={e=>setDescription(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-2">
          {[["gather","تجميع"],["add","إضافة"],["messages","رسائل"],["campaigns","حملات"],["multi","متعدد"]].map(([v,l])=>(
            <Radio key={v} name="p" value={v} checked={purpose===v} onChange={setPurpose} label={l} />
          ))}
        </div>
        <Button className="w-full" disabled={!name} onClick={save}>إنشاء المجموعة</Button>
      </Card>
    </div>
  );
}
