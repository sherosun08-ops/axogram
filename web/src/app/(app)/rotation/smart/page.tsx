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
      <PageHeader title="التدوير الذكي المتقدم" back="/rotation" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تفضيل الأعلى صحة</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تفضيل الأقل استهلاكاً</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تجنب من لديه FloodWait حديث</label>
        <Field label="وزن الصحة" hint="40"><Input placeholder="وزن الصحة" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ قواعد الذكاء");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
