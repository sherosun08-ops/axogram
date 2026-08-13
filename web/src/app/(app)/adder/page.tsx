"use client";
import { PageHeader, RowLink, Stat, Banner } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function AdderHome() {
  const { data, loading } = useApi<{ jobs: any[] }>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const adds = (data?.jobs || []).filter((j) => j.type === "add");
  const running = adds.filter((j) => j.status === "running").length;
  const partial = adds.filter((j) => j.status === "partial" || j.status === "paused").length;
  return (
    <div>
      <PageHeader title="إضافة الأعضاء" subtitle="ضم الأعضاء إلى قروب هدف مع حماية الحسابات" />
      {partial > 0 && <Banner tone="warning" action={<a href="/adder/resume" className="font-semibold">استئناف</a>}>{partial} عملية جزئية قابلة للاستئناف</Banner>}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="⚡" label="جارية" value={running} tone="info" />
        <Stat icon="☑️" label="جزئية" value={partial} tone="warning" />
        <Stat icon="✅" label="نجاح تراكمي" value={adds.reduce((s, j) => s + j.successCount, 0)} tone="success" />
        <Stat icon="❌" label="فشل تراكمي" value={adds.reduce((s, j) => s + j.failCount, 0)} tone="danger" />
      </div>
      <div className="space-y-2">
        <RowLink href="/adder/file" icon="📁" title="الإضافة من ملف" hint="المسار الرئيسي — 8 خطوات" />
        <RowLink href="/adder/manual" icon="⌨️" title="إضافة يدوية" hint="تحقق فوري ثم إضافة" />
        <RowLink href="/adder/smart" icon="🧠" title="إضافة ذكية" hint="تجميع فوري + إضافة" />
        <RowLink href="/adder/multi" icon="📚" title="متعدد المصادر" />
        <RowLink href="/adder/resume" icon="▶️" title="استئناف عملية سابقة" hint={`${partial} جزئية`} />
        <RowLink href="/adder/invite" icon="🔗" title="إرسال رابط الدعوة" />
        <RowLink href="/adder/blacklist" icon="🚫" title="القائمة السوداء" />
        <RowLink href="/adder/logs" icon="📋" title="سجلات وإحصائيات" />
        <RowLink href="/adder/settings" icon="⚙️" title="إعدادات افتراضية" />
      </div>
    </div>
  );
}
