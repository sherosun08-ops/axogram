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
      <PageHeader title="تعديل الترتيب" back="/rotation" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">اسحب الحسابات لإعادة ترتيب الدورة — التغيير يطبَّق على العمليات الجديدة</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ الترتيب");},600);}}>{busy?"جاري...":"حفظ الترتيب"}</Button>
      </Card>
    </div>
  );
}
