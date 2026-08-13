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
      <PageHeader title="التحليلات المتقدمة" back="/reports" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <RowLink href="/reports/today" icon="↗" title="معدل النجاح" />
        <RowLink href="/reports/weekly" icon="↗" title="الأداء والسرعة" />
        <RowLink href="/security/reports" icon="↗" title="الأمان والحماية" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم التحديث");},600);}}>{busy?"جاري...":"تحديث التحليلات"}</Button>
      </Card>
    </div>
  );
}
