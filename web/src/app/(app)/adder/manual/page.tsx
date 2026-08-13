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
      <PageHeader title="إضافة يدوية" back="/adder" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="المعرفات — سطر لكل عضو"><Textarea placeholder="المعرفات — سطر لكل عضو" /></Field>
        <Field label="القروب الهدف" hint=""><Input placeholder="القروب الهدف" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تحقق فوري قبل الإضافة</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم التحقق");},600);}}>{busy?"جاري...":"تحقق ثم أضف"}</Button>
      </Card>
    </div>
  );
}
