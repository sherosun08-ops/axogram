"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Modal, Banner } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function Emergency() {
  const [open,setOpen]=useState("");
  const [word,setWord]=useState("");
  const [msg,setMsg]=useState("");
  async function lock(on:boolean) {
    await api("/api/settings",{method:"PATCH",body:JSON.stringify({emergency_lock:on?"1":"0"})});
    setMsg(on? "تم قفل النظام طوارئياً":"تم فك القفل");
    setOpen(""); setWord("");
  }
  return (
    <div>
      <PageHeader title="الاستجابة للطوارئ" back="/security" />
      {msg && <Banner tone="warning">{msg}</Banner>}
      <div className="space-y-2">
        <Card><div className="font-bold">إيقاف جميع العمليات</div><Button className="mt-2" variant="ghost" onClick={()=>setMsg("أُوقفت كل العمليات الجارية")}>إيقاف الآن</Button></Card>
        <Card><div className="font-bold text-danger">قفل النظام</div><Button className="mt-2" variant="danger" onClick={()=>setOpen("lock")}>قفل</Button></Card>
        <Card><div className="font-bold">فك القفل</div><Button className="mt-2" onClick={()=>lock(false)}>فك القفل</Button></Card>
        <Card><div className="font-bold">حذف طارئ للجلسات</div><Button className="mt-2" variant="danger" onClick={()=>setOpen("wipe")}>حذف</Button></Card>
      </div>
      <Modal open={!!open} danger title="تأكيد خطير" onClose={()=>setOpen("")} footer={
        <Button variant="danger" disabled={word!=="تأكيد"} onClick={()=>lock(true)}>تنفيذ</Button>
      }>
        هذا إجراء لا يُتراجع عنه بسهولة.
        <input className="field mt-3" value={word} onChange={e=>setWord(e.target.value)} placeholder='اكتب «تأكيد»' />
      </Modal>
    </div>
  );
}
