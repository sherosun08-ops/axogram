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
      <PageHeader title="تشفير الجلسات" back="/security" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="warning">تفعيل التشفير يعرض مفتاحاً مرة واحدة — احفظه خارج النظام</Banner>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تشفير ملفات الجلسات</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم تفعيل التشفير");},600);}}>{busy?"جاري...":"تفعيل"}</Button>
      </Card>
    </div>
  );
}
