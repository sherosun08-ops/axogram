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
      <PageHeader title="إزالة غير النشطة" back="/proxy" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="لم تُفحص منذ (يوم)" hint="30"><Input placeholder="لم تُفحص منذ (يوم)" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> لا تحذف المعيَّنة</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("لا نتائج أو جاهز للحذف");},600);}}>{busy?"جاري...":"فحص"}</Button>
      </Card>
    </div>
  );
}
