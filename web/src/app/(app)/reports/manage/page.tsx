"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("30 يوم");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="إدارة السجلات" back="/reports" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">احذف أقدم من</div><Radio name="r" value="30 يوم" checked={val==="30 يوم"} onChange={setVal} label="30 يوم" /><Radio name="r" value="60 يوم" checked={val==="60 يوم"} onChange={setVal} label="60 يوم" /><Radio name="r" value="90 يوم" checked={val==="90 يوم"} onChange={setVal} label="90 يوم" />
        <Banner tone="warning">لا يمكن التراجع — يُنصح بالأرشفة أولاً</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تمت الأرشفة");},600);}}>{busy?"جاري...":"أرشفة ثم حذف"}</Button>
      </Card>
    </div>
  );
}
