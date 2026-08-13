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
      <PageHeader title="إعدادات الرسائل" back="/messages" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="حد يومي" hint="30"><Input placeholder="حد يومي" /></Field>
        <Field label="تأخير بين الرسائل ث" hint="45"><Input placeholder="تأخير بين الرسائل ث" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> توقف عند PeerFlood</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم الحفظ");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
