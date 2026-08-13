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
      <PageHeader title="فحص ظهور الأعضاء" back="/gather" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="رابط القروب" hint=""><Input placeholder="رابط القروب" /></Field>
        <Banner tone="info">إن كانت القائمة مخفية سيُقترح التجميع من الرسائل أو التفاعلات</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("الأعضاء ظاهرة — يمكن التجميع المباشر");},600);}}>{busy?"جاري...":"فحص"}</Button>
      </Card>
    </div>
  );
}
