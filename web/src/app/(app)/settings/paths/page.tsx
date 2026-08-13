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
      <PageHeader title="مسارات التخزين" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="مسار الجلسات" hint="./sessions"><Input placeholder="مسار الجلسات" /></Field>
        <Field label="مسار الملفات" hint="./exports"><Input placeholder="مسار الملفات" /></Field>
        <Field label="مسار السجلات" hint="./logs"><Input placeholder="مسار السجلات" /></Field>
        <Field label="مسار النسخ" hint="./backups"><Input placeholder="مسار النسخ" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ المسارات");},600);}}>{busy?"جاري...":"حفظ المسارات"}</Button>
      </Card>
    </div>
  );
}
