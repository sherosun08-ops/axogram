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
      <PageHeader title="إشعارات النظام" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> تفعيل الإشعارات</label>
        <Field label="وجهة الإشعارات" hint="@telecore_alerts"><Input placeholder="وجهة الإشعارات" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> حظر حساب</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> اكتمال عملية</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> موت بروكسي</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم حفظ إعدادات الإشعارات");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
