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
      <PageHeader title="استيراد قائمة بروكسي" back="/proxy" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="القائمة — سطر لكل بروكسي host:port:user:pass"><Textarea placeholder="القائمة — سطر لكل بروكسي host:port:user:pass" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> اختبار قبل الحفظ</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم التحليل");},600);}}>{busy?"جاري...":"تحليل"}</Button>
      </Card>
    </div>
  );
}
