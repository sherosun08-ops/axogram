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
      <PageHeader title="معلومات النظام" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">الإصدار v1.0.0 · Node · Next.js · SQLite · TeleCore Web</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("أنت على أحدث إصدار");},600);}}>{busy?"جاري...":"فحص تحديث"}</Button>
      </Card>
    </div>
  );
}
