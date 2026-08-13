"use client";
import { useEffect, useState } from "react";
import { PageHeader, Card, Button, Progress, Stat } from "@/components/ui";
import { api } from "@/lib/api-client";
import { useApi } from "@/components/data";

export default function Health() {
  const { data } = useApi<{ accounts: { id: string; firstName: string }[] }>("/api/accounts");
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<any>(null);
  async function start() {
    const r = await api<any>("/api/jobs", { method: "POST", body: JSON.stringify({ type: "health", title: "فحص صحة الحسابات", total: data?.accounts.length || 12 }) });
    setJobId(r.job.id);
    setJob(r.job);
  }
  useEffect(() => {
    if (!jobId || !job || !["running","pending"].includes(job.status)) return;
    const t = setInterval(async () => {
      const r = await api<any>(`/api/jobs/${jobId}`);
      setJob(r.job);
    }, 900);
    return () => clearInterval(t);
  }, [jobId, job?.status]);
  return (
    <div>
      <PageHeader title="فحص الصحة" back="/accounts" />
      {!job && (
        <div className="space-y-2">
          <Button className="w-full" onClick={start}>✅ فحص جميع الحسابات</Button>
          <Button variant="ghost" className="w-full" onClick={start}>☑️ فحص حسابات محددة</Button>
        </div>
      )}
      {job && (
        <Card>
          <div className="mb-2 font-bold">{job.status === "running" ? "🟢 جارٍ الفحص" : "اكتمل الفحص"}</div>
          <Progress value={job.total ? (job.progress / job.total) * 100 : 0} />
          <div className="mt-2 text-sm text-ink-muted">{job.progress} من {job.total} · {job.currentItem || ""}</div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat icon="🟢" label="نجاح" value={job.successCount} tone="success" />
            <Stat icon="⚠️" label="فشل" value={job.failCount} tone="warning" />
            <Stat icon="⏭️" label="تخطي" value={job.skipCount} />
          </div>
        </Card>
      )}
    </div>
  );
}
