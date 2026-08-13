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
      <PageHeader title="سجل الأخطاء والتحذيرات" back="/reports" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">FloodWait و PeerFlood وانقطاع الاتصال</Banner>
        <RowLink href="/reports/analytics" icon="↗" title="تحليل الأخطاء" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم الأرشفة");},600);}}>{busy?"جاري...":"مسح السجل"}</Button>
      </Card>
    </div>
  );
}
