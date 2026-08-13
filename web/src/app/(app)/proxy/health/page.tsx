"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("الكل");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="فحص صحة البروكسي" back="/proxy" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">النطاق</div><Radio name="r" value="الكل" checked={val==="الكل"} onChange={setVal} label="الكل" /><Radio name="r" value="الميتة فقط" checked={val==="الميتة فقط"} onChange={setVal} label="الميتة فقط" /><Radio name="r" value="غير المفحوصة" checked={val==="غير المفحوصة"} onChange={setVal} label="غير المفحوصة" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("بدأ الفحص");},600);}}>{busy?"جاري...":"بدء الفحص"}</Button>
      </Card>
    </div>
  );
}
