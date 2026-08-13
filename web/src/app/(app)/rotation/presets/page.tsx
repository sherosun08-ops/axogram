"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("محافظ");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="سيناريوهات جاهزة" back="/rotation" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">سيناريو</div><Radio name="r" value="محافظ" checked={val==="محافظ"} onChange={setVal} label="محافظ" /><Radio name="r" value="متوازن ⭐" checked={val==="متوازن ⭐"} onChange={setVal} label="متوازن ⭐" /><Radio name="r" value="عدواني" checked={val==="عدواني"} onChange={setVal} label="عدواني" /><Radio name="r" value="ليلي" checked={val==="ليلي"} onChange={setVal} label="ليلي" />
        <Banner tone="warning">التطبيق يستبدل إعدادات التدوير الحالية</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم تطبيق السيناريو");},600);}}>{busy?"جاري...":"تطبيق"}</Button>
      </Card>
    </div>
  );
}
