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
      <PageHeader title="تصدير واستيراد" back="/accounts" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <div className="space-y-2">
        <RowLink href="/accounts/export/sessions" icon="📤" title="تصدير الجلسات" hint="ملفات حساسة — احتفظ بها بأمان" />
        <RowLink href="/accounts/import" icon="📥" title="استيراد / استعادة" hint="من نسخة احتياطية سابقة" />
        <RowLink href="/accounts/export/data" icon="📊" title="تصدير البيانات فقط" hint="CSV / PDF بدون الجلسات" />
      </div>
    
    </div>
  );
}
