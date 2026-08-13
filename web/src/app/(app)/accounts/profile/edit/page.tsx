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
      <PageHeader title="تعديل الملف الشخصي" back="/accounts/profile" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <Card className="space-y-3">
        <Field label="الصورة الشخصية">
          <input type="file" accept="image/*" className="text-sm" />
        </Field>
        <Field label="الاسم الأول"><Input defaultValue="" /></Field>
        <Field label="الاسم الأخير"><Input /></Field>
        <Field label="اسم المستخدم"><Input placeholder="@" /></Field>
        <Field label="البيو" hint="70 حرفاً — 140 للـ Premium"><Textarea /></Field>
        <Button className="w-full" onClick={()=>setMsg("تم تحديث الملف الشخصي")}>حفظ التغييرات</Button>
      </Card>
    
    </div>
  );
}
