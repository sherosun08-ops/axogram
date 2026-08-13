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
      <PageHeader title="القائمة السوداء العالمية" back="/security" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="قيمة" hint="@user"><Input placeholder="قيمة" /></Field>
        <div className="font-semibold">النوع</div><Radio name="r" value="مستخدم" checked={val==="مستخدم"} onChange={setVal} label="مستخدم" /><Radio name="r" value="قروب" checked={val==="قروب"} onChange={setVal} label="قروب" /><Radio name="r" value="كلمة" checked={val==="كلمة"} onChange={setVal} label="كلمة" />
        <Field label="السبب" hint=""><Input placeholder="السبب" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تمت الإضافة");},600);}}>{busy?"جاري...":"إضافة"}</Button>
      </Card>
    </div>
  );
}
