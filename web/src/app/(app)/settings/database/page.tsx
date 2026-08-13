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
      <PageHeader title="قاعدة البيانات" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">SQLite · الحالة سليمة</Banner>
        <RowLink href="/settings/export-csv" icon="↗" title="تصدير CSV لجداول محددة" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("قاعدة البيانات سليمة");},600);}}>{busy?"جاري...":"فحص السلامة"}</Button>
      </Card>
    </div>
  );
}
