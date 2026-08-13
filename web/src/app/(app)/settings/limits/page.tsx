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
      <PageHeader title="الحدود الافتراضية" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="حد الإضافة/حساب" hint="20"><Input placeholder="حد الإضافة/حساب" /></Field>
        <Field label="حد التجميع/حساب" hint="500"><Input placeholder="حد التجميع/حساب" /></Field>
        <Field label="حد الرسائل DM" hint="30"><Input placeholder="حد الرسائل DM" /></Field>
        <Field label="حد حملات القروبات" hint="25"><Input placeholder="حد حملات القروبات" /></Field>
        <Field label="التأخير من (ث)" hint="60"><Input placeholder="التأخير من (ث)" /></Field>
        <Field label="التأخير إلى (ث)" hint="120"><Input placeholder="التأخير إلى (ث)" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تفعيل الحدود الذكية</label>
        <Banner tone="warning">أكثر من 50 إضافة/يوم عدواني جداً</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ الحدود الافتراضية");},600);}}>{busy?"جاري...":"حفظ الحدود"}</Button>
      </Card>
    </div>
  );
}
