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
      <PageHeader title="تصدير البيانات" back="/accounts/export" />
      {msg && <Banner tone="success">{msg}</Banner>}
      
      <Card className="space-y-3">
        {["أسماء الحسابات","أرقام الهواتف","الحالات","التصنيفات والمجموعات","درجات الصحة","إحصائيات الاستخدام"].map(x=>(
          <label key={x} className="flex gap-2"><input type="checkbox" defaultChecked /> {x}</label>
        ))}
        <Button className="w-full" onClick={()=>setMsg("تم تصدير CSV")}>تصدير</Button>
      </Card>
    
    </div>
  );
}
