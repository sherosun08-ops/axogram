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
      <PageHeader title="تسجيل الدخول بـ QR Code" back="/accounts/add" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <Card className="text-center">
        <div className="mx-auto mb-4 flex h-56 w-56 items-center justify-center rounded-2xl bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%230B1F3A%22/><rect x=%228%22 y=%228%22 width=%2284%22 height=%2284%22 fill=%22white%22/><path d=%22M16 16h20v20H16zM64 16h20v20H64zM16 64h20v20H16z%22 fill=%22%230B1F3A%22/></svg>')] bg-contain" />
        <div className="text-sm text-ink-muted">1 افتح تيليجرام · 2 الإعدادات ← الأجهزة · 3 اربط جهاز · 4 امسح الرمز</div>
        <div className="mt-3 text-sm">⏱️ ينتهي الرمز بعد 45 ثانية</div>
        <Button className="mt-4" onClick={() => setMsg("تم تحديث الرمز")}>تحديث الرمز</Button>
        <Link href="/accounts/add" className="btn-ghost mt-2 w-full">العودة لتسجيل الدخول بالرقم</Link>
      </Card>
    
    </div>
  );
}
