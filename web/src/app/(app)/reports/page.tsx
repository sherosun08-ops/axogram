"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function ReportsHome() {
  const { data, loading } = useApi<any>("/api/reports");
  if (loading) return <LoadingGrid />;
  const s = data?.summary || {};
  return (
    <div>
      <PageHeader title="التقارير والسجلات" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="⚡" label="عمليات جارية" value={s.running||0} tone="info" />
        <Stat icon="✅" label="نجاح اليوم" value={s.todaySuccess||0} tone="success" />
        <Stat icon="📥" label="تجميع تراكمي" value={s.gather||0} />
        <Stat icon="📤" label="إضافة تراكمية" value={s.add||0} />
      </div>
      <div className="space-y-2">
        <RowLink href="/reports/live" icon="⚡" title="مركز العمليات الحية" />
        <RowLink href="/reports/today" icon="📅" title="تقرير اليوم" />
        <RowLink href="/reports/weekly" icon="🗓️" title="تقرير أسبوعي" />
        <RowLink href="/reports/monthly" icon="📆" title="تقرير شهري" />
        <RowLink href="/reports/gather" icon="📥" title="سجل التجميع" />
        <RowLink href="/reports/add" icon="📤" title="سجل الإضافة" />
        <RowLink href="/reports/messages" icon="💬" title="سجل الرسائل" />
        <RowLink href="/reports/errors" icon="❌" title="سجل الأخطاء والتحذيرات" />
        <RowLink href="/reports/accounts" icon="👤" title="تقارير الحسابات" />
        <RowLink href="/reports/analytics" icon="📈" title="التحليلات المتقدمة" />
        <RowLink href="/reports/leaderboard" icon="🏆" title="لوحة الترتيب" />
        <RowLink href="/reports/export" icon="📤" title="تصدير التقارير والجدولة" />
        <RowLink href="/reports/manage" icon="🗂️" title="إدارة السجلات" />
      </div>
    </div>
  );
}
