"use client";
import Link from "next/link";
import { PageHeader, Card, Input, Segment } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { proxyStatus } from "@/lib/labels";
import { useMemo, useState } from "react";
export default function ProxyList() {
  const { data, loading } = useApi<{proxies:any[]}>("/api/proxies");
  const [q,setQ]=useState(""); const [tab,setTab]=useState("all");
  const list = useMemo(()=> (data?.proxies||[]).filter((p:any)=>{
    if(q && !(p.host+p.country).includes(q)) return false;
    if(tab!=="all" && p.status!==tab) return false;
    return true;
  }),[data,q,tab]);
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="البروكسيهات" back="/proxy" actions={<Link href="/proxy/add" className="btn-primary">إضافة</Link>} />
      <Input className="mb-3" placeholder="بحث IP أو دولة" value={q} onChange={e=>setQ(e.target.value)} />
      <Segment value={tab} onChange={setTab} options={[{id:"all",label:"الكل"},{id:"alive",label:"نشط"},{id:"dead",label:"ميت"},{id:"slow",label:"بطيء"},{id:"unknown",label:"غير مفحوص"}]} />
      <div className="mt-3 space-y-2">
        {list.map((p:any)=>(
          <Link key={p.id} href={`/proxy/${p.id}`} className="card block p-4">
            <div className="font-bold">{(proxyStatus as any)[p.status]?.icon} {p.host}:{p.port}</div>
            <div className="text-sm text-ink-muted">{p.type} · {p.country||"—"} · {p.latencyMs? `${p.latencyMs}ms`:"—"} · معيَّن لـ {p.accounts?.length||0}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
