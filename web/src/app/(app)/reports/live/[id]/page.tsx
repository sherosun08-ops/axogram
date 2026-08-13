"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader, Card, Button, Progress, Stat } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function JobLive() {
  const { id } = useParams<{id:string}>();
  const [job,setJob]=useState<any>(null);
  async function load(){ const r = await api<any>(`/api/jobs/${id}`); setJob(r.job); }
  useEffect(()=>{ load(); },[id]);
  useEffect(()=>{
    if(!job || job.status!=="running") return;
    const t=setInterval(load,900); return ()=>clearInterval(t);
  },[job?.status]);
  if(!job) return <div className="skeleton h-40" />;
  const logs = JSON.parse(job.liveLog||"[]");
  return (
    <div>
      <PageHeader title={job.title} back="/reports/live" />
      <Card className="mb-3">
        <div className="mb-2 font-bold">{job.status==="running"?"🟢 جارية":job.status}</div>
        <Progress value={job.total? (job.progress/job.total)*100:0} />
        <div className="mt-2 text-sm text-ink-muted">{job.currentItem || `${job.progress} / ${job.total}`}</div>
        <div className="mt-3 flex gap-2">
          {job.status==="running" && <Button variant="ghost" onClick={async()=>{await api(`/api/jobs/${id}`,{method:"PATCH",body:JSON.stringify({status:"paused"})}); load();}}>إيقاف مؤقت</Button>}
          {job.status==="paused" && <Button onClick={async()=>{await api(`/api/jobs/${id}`,{method:"PATCH",body:JSON.stringify({status:"running"})}); load();}}>استئناف</Button>}
          {["running","paused"].includes(job.status) && <Button variant="danger" onClick={async()=>{await api(`/api/jobs/${id}`,{method:"PATCH",body:JSON.stringify({status:"cancelled"})}); load();}}>إيقاف</Button>}
        </div>
      </Card>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <Stat label="نجاح" value={job.successCount} tone="success" />
        <Stat label="فشل" value={job.failCount} tone="danger" />
        <Stat label="تخطي" value={job.skipCount} />
      </div>
      <div className="space-y-1 text-sm">
        {logs.map((l:any,i:number)=>(<div key={i} className="rounded-xl bg-white p-2 border">{l.level==="error"?"❌":l.level==="warn"?"⚠️":"✅"} {l.text}</div>))}
      </div>
    </div>
  );
}
