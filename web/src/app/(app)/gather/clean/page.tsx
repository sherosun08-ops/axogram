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
      <PageHeader title="تنقية ملف" back="/gather" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Banner tone="info">ارفع ملفاً أو اختر من الملفات المصدّرة</Banner>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> حذف المكرر</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> حذف بدون يوزرنيم</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> حذف البوتات</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> حذف المحظورين في السوداء</label>
        <Banner tone="warning">إن أصبح الملف فارغاً لن يُستبدل الأصلي إلا بتأكيد</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("اكتملت التنقية");},600);}}>{busy?"جاري...":"تنقية"}</Button>
      </Card>
    </div>
  );
}
