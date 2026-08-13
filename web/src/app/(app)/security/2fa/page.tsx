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
      <PageHeader title="إدارة 2FA" back="/security" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="الحساب" hint=""><Input placeholder="الحساب" /></Field>
        <Field label="كلمة المرور الحالية" hint=""><Input placeholder="كلمة المرور الحالية" /></Field>
        <Field label="كلمة المرور الجديدة" hint=""><Input placeholder="كلمة المرور الجديدة" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم تحديث 2FA");},600);}}>{busy?"جاري...":"تحديث"}</Button>
      </Card>
    </div>
  );
}
