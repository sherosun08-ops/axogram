"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("العربية");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="اللغة والمظهر" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">اللغة</div><Radio name="r" value="العربية" checked={val==="العربية"} onChange={setVal} label="العربية" /><Radio name="r" value="English" checked={val==="English"} onChange={setVal} label="English" />
        <div className="font-semibold">المنطقة</div><Radio name="r" value="Asia/Riyadh" checked={val==="Asia/Riyadh"} onChange={setVal} label="Asia/Riyadh" /><Radio name="r" value="Asia/Dubai" checked={val==="Asia/Dubai"} onChange={setVal} label="Asia/Dubai" /><Radio name="r" value="Africa/Cairo" checked={val==="Africa/Cairo"} onChange={setVal} label="Africa/Cairo" />
        <div className="font-semibold">تنسيق الوقت</div><Radio name="r" value="24 ساعة" checked={val==="24 ساعة"} onChange={setVal} label="24 ساعة" /><Radio name="r" value="12 ساعة" checked={val==="12 ساعة"} onChange={setVal} label="12 ساعة" />
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم تحديث المظهر");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
