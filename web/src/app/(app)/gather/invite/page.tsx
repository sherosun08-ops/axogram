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
      <PageHeader title="تجميع من رابط دعوة خاص" back="/gather" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="رابط الدعوة" hint="t.me/+xxxxx"><Input placeholder="رابط الدعوة" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> الانضمام تلقائياً قبل التجميع</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> المغادرة بعد الانتهاء</label>
        <Banner tone="info">القروبات الخاصة قد تخفي قائمة الأعضاء — يُستخدم سجل الرسائل كبديل</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم تحليل الرابط — جاهز للتجميع");},600);}}>{busy?"جاري...":"تحليل الرابط"}</Button>
      </Card>
    </div>
  );
}
