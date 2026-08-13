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
      <PageHeader title="فحص SpamBot" back="/security" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">يسأل @SpamBot عن حالة القيد لحساب محدد</Banner>
        <Field label="الحساب" hint=""><Input placeholder="الحساب" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("لا قيود على هذا الحساب");},600);}}>{busy?"جاري...":"فحص"}</Button>
      </Card>
    </div>
  );
}
