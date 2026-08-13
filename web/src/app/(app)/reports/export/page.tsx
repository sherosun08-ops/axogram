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
      <PageHeader title="تصدير التقارير" back="/reports" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> اليوم</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> الأسبوع</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> الأخطاء</label>
        <div className="font-semibold">الصيغة</div><Radio name="r" value="PDF" checked={val==="PDF"} onChange={setVal} label="PDF" /><Radio name="r" value="CSV" checked={val==="CSV"} onChange={setVal} label="CSV" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم التصدير");},600);}}>{busy?"جاري...":"تصدير"}</Button>
      </Card>
    </div>
  );
}
