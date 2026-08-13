"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Select, Banner, RowLink, Stat, Progress, Empty, Modal, Radio, Toggle, Segment } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
import { formatNumber, timeAgo, formatDateTime } from "@/lib/utils";


export default function Screen() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <div>
      <PageHeader title="التسخين" back="/accounts" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <Card className="space-y-3">
        <div className="font-semibold">النطاق</div>
        {[["new","كل الحسابات الجديدة"],["manual","اختيار يدوي"],["group","مجموعة كاملة"]].map(([v,l]) => (
          <Radio key={v} name="scope" value={v} checked={v==="new"} onChange={() => {}} label={l} />
        ))}
        <div className="font-semibold pt-2">الأنشطة</div>
        {["الانضمام لقروبات عامة","قراءة الرسائل","ردود خفيفة","تغيير الصورة والبيو","إضافة جهات اتصال","تفاعلات إيموجي"].map((x,i) => (
          <label key={x} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked={i<2}/> {x}</label>
        ))}
        <div className="font-semibold pt-2">المدة</div>
        <Segment value="7" onChange={() => {}} options={[{id:"1",label:"يوم"},{id:"3",label:"3 أيام"},{id:"7",label:"7 أيام ⭐"},{id:"14",label:"14 يوم"}]} />
        <div className="font-semibold pt-2">الشدة</div>
        <Radio name="int" value="m" checked onChange={() => {}} label="🚶 متوسطة (20–30) ⭐" hint="موصى بها" />
        <Radio name="int" value="h" checked={false} onChange={() => {}} label="🏃 مكثفة (50–80)" hint="خطرة على الحسابات الجديدة" />
        <Button className="w-full" onClick={async () => { setBusy(true); await api("/api/jobs",{method:"POST",body:JSON.stringify({type:"warmup",title:"تسخين حسابات",total:7})}); setBusy(false); setMsg("بدأ التسخين"); }}>بدء التسخين</Button>
      </Card>
    
    </div>
  );
}
