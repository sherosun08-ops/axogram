"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("ذكي");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="إعدادات التدوير" back="/rotation" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">الوضع</div><Radio name="r" value="ذكي" checked={val==="ذكي"} onChange={setVal} label="ذكي" /><Radio name="r" value="تسلسلي" checked={val==="تسلسلي"} onChange={setVal} label="تسلسلي" /><Radio name="r" value="عشوائي" checked={val==="عشوائي"} onChange={setVal} label="عشوائي" /><Radio name="r" value="يدوي" checked={val==="يدوي"} onChange={setVal} label="يدوي" />
        <Field label="التبديل بعد N عملية" hint="10"><Input placeholder="التبديل بعد N عملية" /></Field>
        <Field label="راحة بعد N عملية" hint="20"><Input placeholder="راحة بعد N عملية" /></Field>
        <Field label="مدة الراحة بالدقائق" hint="20"><Input placeholder="مدة الراحة بالدقائق" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد المقيدين</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد الجلسات الميتة</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد قيد التسخين</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ إعدادات التدوير");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
