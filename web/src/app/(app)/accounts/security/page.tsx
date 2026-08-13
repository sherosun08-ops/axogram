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
      <PageHeader title="أمان الحسابات" back="/accounts" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <div className="space-y-2">
        <RowLink href="/security/scan" icon="🛡️" title="فحص أمان شامل" hint="يفحص كل الحسابات ويكشف المشاكل" />
        <RowLink href="/security/devices" icon="📱" title="أجهزة حساب محدد" hint="اعرض وأنهِ الجلسات المتصلة" />
        <RowLink href="/security/2fa" icon="🔐" title="إدارة التحقق بخطوتين" hint="تفعيل أو تحديث كلمة مرور 2FA" />
        <RowLink href="/accounts/health" icon="✅" title="فحص سريع للحالة" hint="بدون مغادرة مدير الحسابات" />
      </div>
    
    </div>
  );
}
