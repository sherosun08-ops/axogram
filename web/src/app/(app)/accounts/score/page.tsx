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
      <PageHeader title="درجة الصحة" back="/accounts" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <Card className="mb-4">
        <div className="font-bold text-navy">ما هي درجة الصحة؟</div>
        <p className="mt-1 text-sm text-ink-muted">مقياس يقدّر مدى أمان الحساب للاستخدام بناءً على عوامل متعددة.</p>
        <div className="mt-3 space-y-1 text-sm">
          <div>🟢 ممتاز 90–100%</div>
          <div>🟢 جيد 70–89%</div>
          <div>🟡 متوسط 50–69%</div>
          <div>🔴 ضعيف أقل من 50%</div>
        </div>
      </Card>
      <Card>
        <div className="font-semibold mb-2">العوامل المحسوبة</div>
        {[["العمر التقديري","20%"],["النشاط السابق","20%"],["FloodWaits الأسبوعية","15%"],["عدد القروبات","15%"],["الصورة والبيو","10%"],["جهات الاتصال","10%"],["سجل الأخطاء الأخير","10%"]].map(([k,v]) => (
          <div key={k} className="flex justify-between py-1 text-sm"><span>{k}</span><span className="text-ink-muted">{v}</span></div>
        ))}
        <Banner tone="warning">العمر تقديري من نطاق المعرف وليس رسمياً من API</Banner>
        <Button className="w-full" onClick={() => setMsg("أُعيد حساب درجات الصحة")}>إعادة حساب الكل</Button>
      </Card>
    
    </div>
  );
}
