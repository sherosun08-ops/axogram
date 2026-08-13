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
      <PageHeader title="إشعارات البروكسي" back="/proxy" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> موت بروكسي معيَّن</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> ارتفاع الكمون</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> فشل فحص دوري</label>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم الحفظ");},600);}}>{busy?"جاري...":"حفظ"}</Button>
      </Card>
    </div>
  );
}
