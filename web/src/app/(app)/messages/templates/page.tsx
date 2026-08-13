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
      <PageHeader title="قوالب الرسائل" back="/messages" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="اسم القالب" hint=""><Input placeholder="اسم القالب" /></Field>
        <Field label="النص"><Textarea placeholder="النص" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم الحفظ");},600);}}>{busy?"جاري...":"حفظ القالب"}</Button>
      </Card>
    </div>
  );
}
