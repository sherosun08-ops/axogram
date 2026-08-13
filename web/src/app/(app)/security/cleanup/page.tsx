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
      <PageHeader title="تنظيف الحسابات" back="/security" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> مغادرة قروبات قديمة</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> حذف رسائل محفوظة</label>
        <Banner tone="warning">لا يمكن مغادرة قروب أنت منشئه</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("بدأ التنظيف");},600);}}>{busy?"جاري...":"بدء التنظيف"}</Button>
      </Card>
    </div>
  );
}
