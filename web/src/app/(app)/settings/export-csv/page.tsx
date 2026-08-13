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
      <PageHeader title="تصدير بيانات CSV" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> الحسابات</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> البروكسيهات</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> العمليات</label>
        <div className="font-semibold">الفترة</div><Radio name="r" value="كل السجلات" checked={val==="كل السجلات"} onChange={setVal} label="كل السجلات" /><Radio name="r" value="آخر 30 يوم" checked={val==="آخر 30 يوم"} onChange={setVal} label="آخر 30 يوم" /><Radio name="r" value="آخر 90 يوم" checked={val==="آخر 90 يوم"} onChange={setVal} label="آخر 90 يوم" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("اكتمل التصدير");},600);}}>{busy?"جاري...":"تصدير"}</Button>
      </Card>
    </div>
  );
}
