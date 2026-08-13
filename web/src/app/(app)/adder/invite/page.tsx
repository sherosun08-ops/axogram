"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="إرسال رابط الدعوة" back="/adder" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="القروب الهدف" hint=""><Input placeholder="القروب الهدف" /></Field>
        <div className="font-semibold">طريقة الرابط</div><Radio name="r" value="جلب الرابط الحالي" checked={val==="جلب الرابط الحالي"} onChange={setVal} label="جلب الرابط الحالي" /><Radio name="r" value="إنشاء رابط جديد" checked={val==="إنشاء رابط جديد"} onChange={setVal} label="إنشاء رابط جديد" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> إرسال مباشر عبر رسالة خاصة</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم تجهيز الرابط");},600);}}>{busy?"جاري...":"متابعة"}</Button>
      </Card>
    </div>
  );
}
