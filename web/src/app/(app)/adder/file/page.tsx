"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Radio, Banner } from "@/components/ui";
import { api } from "@/lib/api-client";
import { useApi } from "@/components/data";

export default function AddFromFile() {
  const router = useRouter();
  const { data } = useApi<{files:any[]}>("/api/files");
  const [fileId,setFileId]=useState("");
  const [target,setTarget]=useState("https://t.me/clients_vip");
  const [method,setMethod]=useState("add");
  async function start() {
    const job = await api<any>("/api/jobs",{method:"POST",body:JSON.stringify({type:"add",title:"إضافة من ملف",total:400,config:{fileId,target,method}})});
    router.push(`/reports/live/${job.job.id}`);
  }
  return (
    <div>
      <PageHeader title="الإضافة من ملف" back="/adder" />
      <Card className="space-y-3">
        <Field label="الملف">
          <select className="field" value={fileId} onChange={e=>setFileId(e.target.value)}>
            <option value="">اختر ملفاً...</option>
            {(data?.files||[]).map((f:any)=><option key={f.id} value={f.id}>{f.name} ({f.membersCount})</option>)}
          </select>
        </Field>
        <Field label="القروب الهدف"><Input value={target} onChange={e=>setTarget(e.target.value)} /></Field>
        <Radio name="m" value="add" checked={method==="add"} onChange={setMethod} label="إضافة مباشرة" />
        <Radio name="m" value="invite" checked={method==="invite"} onChange={setMethod} label="دعوة عبر رسالة خاصة" hint="عندما تكون الإضافة مقفلة" />
        <Banner tone="info">يُطبَّق الفلتر: موجود مسبقاً / سوداء / خصوصية مغلقة / بوت</Banner>
        <Button className="w-full" onClick={start}>بدء الإضافة</Button>
      </Card>
    </div>
  );
}
