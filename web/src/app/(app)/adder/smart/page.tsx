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
      <PageHeader title="إضافة ذكية" back="/adder" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="قروب المصدر" hint=""><Input placeholder="قروب المصدر" /></Field>
        <Field label="قروب الهدف" hint=""><Input placeholder="قروب الهدف" /></Field>
        <Banner tone="info">يجمع ثم يضيف في عملية واحدة مرحلية</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("بدأت الإضافة الذكية");},600);}}>{busy?"جاري...":"بدء"}</Button>
      </Card>
    </div>
  );
}
