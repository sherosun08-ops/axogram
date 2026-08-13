"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("يدوي");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="تعيين البروكسيهات" back="/proxy" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <div className="font-semibold">الطريقة</div><Radio name="r" value="يدوي" checked={val==="يدوي"} onChange={setVal} label="يدوي" /><Radio name="r" value="تلقائي ذكي" checked={val==="تلقائي ذكي"} onChange={setVal} label="تلقائي ذكي" /><Radio name="r" value="تدوير دوري" checked={val==="تدوير دوري"} onChange={setVal} label="تدوير دوري" />
        <Banner tone="info">التعيين الذكي يوزّع حسب الدولة والكمون</Banner>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("تم التعيين");},600);}}>{busy?"جاري...":"تطبيق"}</Button>
      </Card>
    </div>
  );
}
