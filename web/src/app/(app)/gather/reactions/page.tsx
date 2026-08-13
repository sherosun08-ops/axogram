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
      <PageHeader title="تجميع من تفاعلات رسائل" back="/gather" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="رابط الرسالة" hint=""><Input placeholder="رابط الرسالة" /></Field>
        <Field label="أنواع الإيموجي (فارغ = الكل)" hint=""><Input placeholder="أنواع الإيموجي (فارغ = الكل)" /></Field>
        <Banner tone="warning">الرسائل القديمة جداً قد تفقد قائمة المتفاعلين</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("بدأ استخراج المتفاعلين");},600);}}>{busy?"جاري...":"بدء الاستخراج"}</Button>
      </Card>
    </div>
  );
}
