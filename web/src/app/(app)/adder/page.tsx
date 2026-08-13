"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function AdderHome() {
  const { data, loading } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const adds = (data?.jobs||[]).filter((j:any)=>j.type==="add");
  const running = adds.filter((j:any)=>j.status==="running").length;
  const partial = adds.filter((j:any)=>j.status==="partial").length;
  return (
    <div>
      <PageHeader title="إضافة الأعضاء" subtitle="ضم الأعضاء إلى قروب هدف مع حماية الحسابات" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="⚡" label="جارية" value={running} tone="info" />
        <Stat icon="☑️" label="جزئية قابلة للاستئناف" value={partial} tone="warning" />
      </div>
      <div className="space-y-2">
        <RowLink href="/adder/file" icon="📁" title="الإضافة من ملف" hint="المسار الرئيسي" />
        <RowLink href="/adder/manual" icon="⌨️" title="إضافة يدوية" hint="يوزرنيم أو رقم أو معرف" />
        <RowLink href="/adder/smart" icon="🧠" title="إضافة ذكية" hint="تجميع فوري ثم إضافة" />
        <RowLink href="/adder/multi" icon="📚" title="متعدد المصادر" />
        <RowLink href="/adder/resume" icon="▶️" title="استئناف عملية سابقة" />
        <RowLink href="/adder/invite" icon="🔗" title="إرسال رابط الدعوة" />
        <RowLink href="/adder/blacklist" icon="🚫" title="القائمة السوداء" />
        <RowLink href="/adder/logs" icon="📋" title="سجلات وإحصائيات" />
        <RowLink href="/adder/settings" icon="⚙️" title="إعدادات افتراضية" />
      </div>
    </div>
  );
}
