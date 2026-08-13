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
      <PageHeader title="إعدادات البروكسي" back="/proxy" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="فترة الفحص الدوري بالدقائق" hint="30"><Input placeholder="فترة الفحص الدوري بالدقائق" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> إجبار بروكسي على كل حساب</label>
        <Field label="مهلة الاختبار بالثواني" hint="8"><Input placeholder="مهلة الاختبار بالثواني" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ الإعدادات");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
