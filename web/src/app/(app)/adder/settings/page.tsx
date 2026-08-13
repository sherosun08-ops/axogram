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
      <PageHeader title="إعدادات الإضافة الافتراضية" back="/adder" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="حد الإضافة اليومي" hint="20"><Input placeholder="حد الإضافة اليومي" /></Field>
        <Field label="التأخير الأدنى بالثواني" hint="60"><Input placeholder="التأخير الأدنى بالثواني" /></Field>
        <Field label="التأخير الأقصى" hint="120"><Input placeholder="التأخير الأقصى" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تخطي الموجودين في القروب</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> إضافة للسوداء عند خصوصية مغلقة</label>
        <Banner tone="warning">أكثر من 50 إضافة/يوم عدواني ويزيد خطر PeerFlood</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ الإعدادات");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
