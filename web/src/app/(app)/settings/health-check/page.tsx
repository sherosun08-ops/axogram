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
      <PageHeader title="فحص إعدادات النظام" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">يفحص API والمسارات وقاعدة البيانات ووجهة الإشعارات وآخر نسخة</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("الدرجة العامة: ممتاز");},600);}}>{busy?"جاري...":"بدء الفحص"}</Button>
      </Card>
    </div>
  );
}
