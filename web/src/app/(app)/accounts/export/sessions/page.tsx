"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Select, Banner, RowLink, Stat, Progress, Empty, Modal, Radio, Toggle, Segment } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
import { formatNumber, timeAgo, formatDateTime } from "@/lib/utils";


export default function Screen() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <div>
      <PageHeader title="تصدير الجلسات" back="/accounts/export" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <Card className="space-y-3">
        <div className="font-semibold">النطاق</div>
        {["جميع الحسابات","حسابات محددة","مجموعة كاملة"].map((x,i)=>(
          <Radio key={x} name="s" value={x} checked={i===0} onChange={()=>{}} label={x} />
        ))}
        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> ملفات .session</label>
        <label className="flex items-center gap-2"><input type="checkbox" /> String Sessions</label>
        <label className="flex items-center gap-2"><input type="checkbox" /> ZIP مضغوط</label>
        <Banner tone="warning">ملفات الجلسات تمنح دخولاً كاملاً للحسابات — احتفظ بها بأمان تام</Banner>
        <Button className="w-full" onClick={()=>setMsg("تم تجهيز التصدير")}>تصدير</Button>
      </Card>
    
    </div>
  );
}
