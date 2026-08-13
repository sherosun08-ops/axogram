"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("كل الحسابات");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="فحص أمان شامل" back="/security" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">النطاق</div><Radio name="r" value="كل الحسابات" checked={val==="كل الحسابات"} onChange={setVal} label="كل الحسابات" /><Radio name="r" value="حساب محدد" checked={val==="حساب محدد"} onChange={setVal} label="حساب محدد" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("بدأ الفحص الشامل");},600);}}>{busy?"جاري...":"بدء الفحص"}</Button>
      </Card>
    </div>
  );
}
