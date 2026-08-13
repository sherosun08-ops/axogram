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
      <PageHeader title="جدولة الحملات" back="/campaigns" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="التاريخ" hint=""><Input placeholder="التاريخ" /></Field>
        <Field label="الوقت" hint="21:00"><Input placeholder="الوقت" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تكرار أسبوعي</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تمت الجدولة");},600);}}>{busy?"جاري...":"جدولة"}</Button>
      </Card>
    </div>
  );
}
