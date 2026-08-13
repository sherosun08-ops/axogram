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
      <PageHeader title="الأمان والحماية" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">مستوى الأمان</div><Radio name="r" value="محافظ" checked={val==="محافظ"} onChange={setVal} label="محافظ" /><Radio name="r" value="متوازن ⭐" checked={val==="متوازن ⭐"} onChange={setVal} label="متوازن ⭐" /><Radio name="r" value="عدواني" checked={val==="عدواني"} onChange={setVal} label="عدواني" />
        <div className="font-semibold">عند FloodWait</div><Radio name="r" value="انتظار + متابعة" checked={val==="انتظار + متابعة"} onChange={setVal} label="انتظار + متابعة" /><Radio name="r" value="تبديل حساب" checked={val==="تبديل حساب"} onChange={setVal} label="تبديل حساب" /><Radio name="r" value="إيقاف" checked={val==="إيقاف"} onChange={setVal} label="إيقاف" />
        <Field label="حد إيقاف الفشل %" hint="30"><Input placeholder="حد إيقاف الفشل %" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ إعدادات الأمان");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
