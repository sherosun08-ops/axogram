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
      <PageHeader title="دمج ملفات" back="/gather" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">اختر ملفين أو أكثر للدمج مع إزالة التكرار</Banner>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> إزالة التكرار بالمعرّف</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> الاحتفاظ بأحدث بيانات العضو</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم إنشاء ملف الدمج");},600);}}>{busy?"جاري...":"دمج"}</Button>
      </Card>
    </div>
  );
}
