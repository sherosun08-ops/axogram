"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("أسبوع");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="تقارير الأمان" back="/security" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">الفترة</div><Radio name="r" value="أسبوع" checked={val==="أسبوع"} onChange={setVal} label="أسبوع" /><Radio name="r" value="شهر" checked={val==="شهر"} onChange={setVal} label="شهر" /><Radio name="r" value="مخصص" checked={val==="مخصص"} onChange={setVal} label="مخصص" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم إنشاء التقرير");},600);}}>{busy?"جاري...":"إنشاء التقرير"}</Button>
      </Card>
    </div>
  );
}
