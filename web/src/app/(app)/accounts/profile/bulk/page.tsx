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
      <PageHeader title="تعديل جماعي للملف الشخصي" back="/accounts/profile" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <Card className="space-y-3">
        {["الصور الشخصية من مجلد","الأسماء من ملف نصي","البيو من ملف نصي"].map(x=>(
          <label key={x} className="flex items-center gap-2"><input type="checkbox" /> {x}</label>
        ))}
        <Field label="التأخير بين الحسابات">
          <Select defaultValue="30"><option>10 ث</option><option value="30">30 ث ⭐</option><option>دقيقة</option></Select>
        </Field>
        <Button className="w-full" onClick={()=>setMsg("بدأ التنفيذ الجماعي")}>بدء التنفيذ</Button>
      </Card>
    
    </div>
  );
}
