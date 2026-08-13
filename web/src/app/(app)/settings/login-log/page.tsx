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
      <PageHeader title="سجل محاولات الدخول" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">آخر محاولات الدخول للوحة — ناجح وفاشل ومرفوض</Banner>
        <RowLink href="/settings/access" icon="↗" title="أمان الوصول" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم التصدير");},600);}}>{busy?"جاري...":"تصدير السجل"}</Button>
      </Card>
    </div>
  );
}
