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
      <PageHeader title="استيراد الجلسات" back="/accounts" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <div className="space-y-2">
        {[
          ["من مجلد", "ارفع عدة ملفات .session"],
          ["ملف واحد", "جلسة واحدة للفحص"],
          ["ملف نصي", "أرقام + جلسات سطراً بسطر"],
          ["String Sessions", "سلاسل Telethon / Pyrogram"],
          ["ملف ZIP", "أرشيف مضغوط — قد يكون مشفراً"],
        ].map(([t,h]) => (
          <Card key={t}>
            <div className="font-bold text-navy">{t}</div>
            <div className="text-sm text-ink-muted">{h}</div>
            <input type="file" className="mt-3 text-sm" multiple onChange={() => setOpen(true)} />
          </Card>
        ))}
      </div>
      <Modal open={open} title="نتائج الفحص" onClose={() => setOpen(false)} footer={<Button onClick={() => {setOpen(false); setMsg("أُضيفت الجلسات الصالحة");}}>استيراد الصالحة</Button>}>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>✅ صالح 8</div><div>❌ تالف 1</div><div>🔁 مكرر 2</div>
        </div>
        <div className="mt-3 space-y-1 text-sm">
          <div>✅ جلسة_1.session</div>
          <div>❌ جلسة_3.session — تالف</div>
          <div>🔐 جلسة_6.session — 2FA</div>
        </div>
      </Modal>
    
    </div>
  );
}
