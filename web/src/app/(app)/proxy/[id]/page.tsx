"use client";
import { useParams, useRouter } from "next/navigation";
import { PageHeader, Card, Button, Modal } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
import { useState } from "react";
export default function ProxyDetail() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const { data, loading, reload } = useApi<{proxy:any}>(`/api/proxies/${id}`);
  const [msg,setMsg]=useState(""); const [del,setDel]=useState(false);
  if (loading) return <LoadingGrid />;
  const p = data?.proxy;
  if(!p) return <div>غير موجود</div>;
  return (
    <div>
      <PageHeader title={`${p.host}:${p.port}`} back="/proxy/list" />
      {msg && <div className="mb-3 rounded-xl bg-accent-soft p-3 text-sm">{msg}</div>}
      <Card className="mb-3 space-y-1 text-sm">
        <div>النوع: {p.type}</div>
        <div>الحالة: {p.status} · الكمون: {p.latencyMs??"—"}ms</div>
        <div>الدولة: {p.country||"—"} · الفشل: {p.failCount}</div>
        <div>معيَّن لـ: {p.accounts.map((a:any)=>a.firstName).join("، ") || "لا أحد"}</div>
      </Card>
      <div className="space-y-2">
        <Button className="w-full" onClick={async()=>{const r=await api<any>(`/api/proxies/${id}/check`,{method:"POST"}); setMsg(r.message); reload();}}>فحص الآن</Button>
        <Button variant="danger" className="w-full" onClick={()=>setDel(true)}>حذف</Button>
      </div>
      <Modal open={del} danger title="حذف البروكسي؟" onClose={()=>setDel(false)} footer={
        <Button variant="danger" onClick={async()=>{await api(`/api/proxies/${id}`,{method:"DELETE"}); router.push("/proxy/list");}}>حذف</Button>
      }>الحسابات المعيَّنة ستفقد مسارها.</Modal>
    </div>
  );
}
