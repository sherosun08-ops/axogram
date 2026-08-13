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
      <PageHeader title="إدارة غير النشطة" back="/accounts" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <div className="space-y-3">
        <Card>
          <div className="font-bold">🗑 إزالة المحظورة تلقائياً</div>
          <Button className="mt-3" onClick={()=>setOpen(true)}>فحص الآن</Button>
        </Card>
        <Card>
          <div className="font-bold">🧹 تنظيف القديمة غير المستخدمة</div>
          <Segment value="90" onChange={()=>{}} options={[{id:"30",label:"30 يوم"},{id:"60",label:"60"},{id:"90",label:"90"}]} />
          <Button className="mt-3" variant="ghost" onClick={()=>setOpen(true)}>فحص</Button>
        </Card>
      </div>
      <Modal open={open} title="نتائج الفحص" onClose={()=>setOpen(false)} footer={<Button variant="danger" onClick={()=>{setOpen(false); setMsg("تمت الأرشفة");}}>حذف المعروض</Button>}>
        مستثنى: الحسابات الرئيسية والمجمّدة قيد الاستئناف.
      </Modal>
    
    </div>
  );
}
