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
      <PageHeader title="مدير الملف الشخصي" back="/accounts" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <div className="space-y-2">
        <RowLink href="/accounts/profile/edit" icon="👤" title="تعديل حساب واحد" hint="الاسم والصورة والبيو واليوزرنيم" />
        <RowLink href="/accounts/profile/bulk" icon="👥" title="تعديل جماعي لعدة حسابات" hint="صور وأسماء وبيو من ملفات" />
      </div>
    
    </div>
  );
}
