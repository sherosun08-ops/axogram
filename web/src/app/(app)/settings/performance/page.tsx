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
      <PageHeader title="الأداء" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="عمليات متزامنة" hint="3"><Input placeholder="عمليات متزامنة" /></Field>
        <Field label="حجم Cache MB" hint="256"><Input placeholder="حجم Cache MB" /></Field>
        <Field label="مهلة الطلبات ث" hint="30"><Input placeholder="مهلة الطلبات ث" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ إعدادات الأداء");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
