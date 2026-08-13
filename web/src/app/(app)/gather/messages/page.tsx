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
      <PageHeader title="تجميع من سجل الرسائل" back="/gather" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="رابط القروب" hint=""><Input placeholder="رابط القروب" /></Field>
        <Field label="عدد الرسائل للمسح" hint="2000"><Input placeholder="عدد الرسائل للمسح" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد البوتات</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد المحذوفين</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("بدأت عملية المسح");},600);}}>{busy?"جاري...":"بدء المسح"}</Button>
      </Card>
    </div>
  );
}
