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
      <PageHeader title="تصفير العدادات" back="/rotation" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="warning">التصفير يؤثر على قرار التدوير فوراً — لا يُلغى</Banner>
        <div className="font-semibold">النطاق</div><Radio name="r" value="كل الحسابات" checked={val==="كل الحسابات"} onChange={setVal} label="كل الحسابات" /><Radio name="r" value="مجموعة" checked={val==="مجموعة"} onChange={setVal} label="مجموعة" /><Radio name="r" value="حسابات محددة" checked={val==="حسابات محددة"} onChange={setVal} label="حسابات محددة" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم تصفير العدادات");},600);}}>{busy?"جاري...":"تصفير"}</Button>
      </Card>
    </div>
  );
}
