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
      <PageHeader title="اكتشاف قروبات" back="/gather" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="كلمات البحث" hint="تسويق، عقارات، برمجة"><Input placeholder="كلمات البحث" /></Field>
        <div className="font-semibold">النوع</div><Radio name="r" value="قروبات" checked={val==="قروبات"} onChange={setVal} label="قروبات" /><Radio name="r" value="قنوات" checked={val==="قنوات"} onChange={setVal} label="قنوات" /><Radio name="r" value="الكل" checked={val==="الكل"} onChange={setVal} label="الكل" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("عُثر على 24 نتيجة");},600);}}>{busy?"جاري...":"بحث"}</Button>
      </Card>
    </div>
  );
}
