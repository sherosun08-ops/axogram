"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("Error");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="إعدادات التسجيل" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">المستوى</div><Radio name="r" value="Error" checked={val==="Error"} onChange={setVal} label="Error" /><Radio name="r" value="Warning" checked={val==="Warning"} onChange={setVal} label="Warning" /><Radio name="r" value="Info ⭐" checked={val==="Info ⭐"} onChange={setVal} label="Info ⭐" /><Radio name="r" value="Debug" checked={val==="Debug"} onChange={setVal} label="Debug" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> ضغط الملفات القديمة</label>
        <Field label="حذف بعد (يوم)" hint="30"><Input placeholder="حذف بعد (يوم)" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ التسجيل");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
