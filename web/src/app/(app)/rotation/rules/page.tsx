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
      <PageHeader title="قواعد الاستبعاد التلقائي" back="/rotation" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد عند FloodWait متكرر</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد عند فشل اتصال</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد عند انخفاض الصحة تحت 50</label>
        <Field label="عدد FloodWait قبل الاستبعاد" hint="3"><Input placeholder="عدد FloodWait قبل الاستبعاد" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ القواعد");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
