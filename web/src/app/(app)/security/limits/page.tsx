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
      <PageHeader title="الحدود الذكية" back="/security" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">حساب أقل من 30 يوماً: 10/يوم · 1–6 أشهر: 20/يوم · أكبر: 35/يوم · Premium مع هامش</Banner>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تطبيق الموصى بها الآن</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم تطبيق الحدود الذكية");},600);}}>{busy?"جاري...":"تطبيق"}</Button>
      </Card>
    </div>
  );
}
