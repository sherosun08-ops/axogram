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
      <PageHeader title="تجميع جماعي" back="/gather" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="روابط القروبات — سطر لكل قروب"><Textarea placeholder="روابط القروبات — سطر لكل قروب" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تخطي القروبات المخفية</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> إزالة التكرار بين القروبات</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("اكتمل التحليل الجماعي");},600);}}>{busy?"جاري...":"تحليل الكل"}</Button>
      </Card>
    </div>
  );
}
