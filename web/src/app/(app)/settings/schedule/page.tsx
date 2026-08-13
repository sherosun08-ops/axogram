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
      <PageHeader title="الجدولة التلقائية" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تصفير العدادات يومياً</label>
        <Field label="وقت التصفير" hint="00:00"><Input placeholder="وقت التصفير" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> فحص صحة الحسابات يومياً</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> نسخ احتياطي تلقائي</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ الجدولة");},600);}}>{busy?"جاري...":"حفظ الجدولة"}</Button>
      </Card>
    </div>
  );
}
