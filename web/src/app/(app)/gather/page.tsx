"use client";
import Link from "next/link";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatNumber } from "@/lib/utils";

export default function GatherHome() {
  const { data, loading } = useApi<{files:any[]}>("/api/files");
  const { data: jobs } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const files = data?.files || [];
  const g = (jobs?.jobs||[]).filter((j:any)=>j.type==="gather");
  return (
    <div>
      <PageHeader title="تجميع الأعضاء" subtitle="استخراج الأعضاء من القروبات والقنوات" />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon="📁" label="ملفات جاهزة" value={formatNumber(files.length)} />
        <Stat icon="👥" label="أعضاء مُصدَّرون" value={formatNumber(files.reduce((s:number,f:any)=>s+f.membersCount,0))} />
        <Stat icon="⚡" label="عمليات تجميع" value={g.length} />
        <Stat icon="✅" label="آخر عملية" value={g[0]?.successCount || 0} tone="success" />
      </div>
      <div className="space-y-2">
        <RowLink href="/gather/public" icon="🌐" title="تجميع من قروب عام" hint="بالرابط أو المعرف" />
        <RowLink href="/gather/invite" icon="🔗" title="تجميع من رابط دعوة خاص" hint="ينضم ثم يجمع ثم يغادر اختيارياً" />
        <RowLink href="/gather/messages" icon="💬" title="تجميع من سجل الرسائل" hint="من تكلّم في القروب" />
        <RowLink href="/gather/visibility" icon="👁️" title="فحص ظهور الأعضاء" hint="قبل بدء التجميع" />
        <RowLink href="/gather/reactions" icon="⭐" title="تجميع من تفاعلات رسائل" hint="من ضغط إيموجي" />
        <RowLink href="/gather/multi" icon="📚" title="استخراج جماعي من عدة قروبات" />
        <RowLink href="/gather/discover" icon="🔎" title="بحث متقدم واكتشاف قروبات" />
        <RowLink href="/gather/clean" icon="🧹" title="تنقية ملف" />
        <RowLink href="/gather/merge" icon="🧬" title="دمج ملفات" />
        <RowLink href="/gather/files" icon="📁" title="إدارة الملفات المُصدَّرة" hint={`${files.length} ملف`} />
        <RowLink href="/gather/templates" icon="📄" title="قوالب التجميع" />
        <RowLink href="/gather/stats" icon="📊" title="إحصائيات التجميع" />
      </div>
    </div>
  );
}
