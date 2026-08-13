"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Modal, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
import { accountStatus } from "@/lib/labels";

export default function GroupDetail() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const { data, loading, reload } = useApi<{group:any}>(`/api/accounts/groups/${id}`);
  const [del,setDel]=useState(false);
  if (loading) return <LoadingGrid />;
  const g = data?.group;
  if (!g) return <div>غير موجودة</div>;
  const health = g.accounts?.length ? Math.round(g.accounts.reduce((s:number,a:any)=>s+a.healthScore,0)/g.accounts.length) : 0;
  return (
    <div>
      <PageHeader title={g.name} back="/accounts/groups" />
      <Card className="mb-4">
        <div>الغرض: {g.purpose}</div>
        <div>إجمالي الحسابات: {g.accounts.length} · صحة المجموعة: {health}%</div>
        <div className="text-sm text-ink-muted">{g.description}</div>
      </Card>
      <div className="space-y-2 mb-4">
        {g.accounts.map((a:any) => (
          <Link key={a.id} href={`/accounts/${a.id}`} className="card flex justify-between p-3">
            <span>{(accountStatus as any)[a.status]?.icon} {a.firstName} {a.lastName}</span>
            <span className="text-sm text-ink-muted">{a.healthScore}%</span>
          </Link>
        ))}
        {g.accounts.length===0 && <Empty icon="👥" title="هذه المجموعة فارغة" />}
      </div>
      <Button variant="danger" className="w-full" onClick={()=>setDel(true)}>حذف المجموعة</Button>
      <Modal open={del} danger title="حذف المجموعة؟" onClose={()=>setDel(false)} footer={
        <><Button variant="ghost" onClick={()=>setDel(false)}>إلغاء</Button>
        <Button variant="danger" onClick={async()=>{await api(`/api/accounts/groups/${id}`,{method:"DELETE"}); router.push("/accounts/groups");}}>حذف</Button></>
      }>سيُحذف تصنيف المجموعة فقط — الحسابات ستبقى في الأداة.</Modal>
    </div>
  );
}
