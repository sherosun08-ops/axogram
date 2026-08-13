"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function NewCamp() {
  const router = useRouter();
  const [name,setName]=useState(""); const [message,setMessage]=useState("");
  async function save() {
    await api("/api/campaigns",{method:"POST",body:JSON.stringify({kind:"groups",name,message,targetsCount:10,status:"draft"})});
    router.push("/campaigns/list");
  }
  return (
    <div>
      <PageHeader title="إنشاء حملة قروبات" back="/campaigns" />
      <Card className="space-y-3">
        <Field label="اسم الحملة"><Input value={name} onChange={e=>setName(e.target.value)} /></Field>
        <Field label="الرسالة"><Textarea value={message} onChange={e=>setMessage(e.target.value)} /></Field>
        <Button className="w-full" disabled={!name||!message} onClick={save}>حفظ</Button>
      </Card>
    </div>
  );
}
