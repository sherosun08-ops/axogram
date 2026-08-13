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
      <PageHeader title="النسخ الاحتياطي" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> جلسات الحسابات</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> قاعدة البيانات</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> الإعدادات</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تشفير الملف</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم إنشاء النسخة الاحتياطية");},600);}}>{busy?"جاري...":"نسخ الآن"}</Button>
      </Card>
    </div>
  );
}
