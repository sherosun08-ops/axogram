"use client";
import { PageHeader, RowLink, Card } from "@/components/ui";
import { useApi } from "@/components/data";
export default function Page() {
  const { data } = useApi<any>("/api/reports");
  const s = data?.summary || {};
  const rate = s.todaySuccess + s.todayFail ? Math.round((s.todaySuccess / (s.todaySuccess + s.todayFail)) * 100) : 0;
  return (
    <div>
      <PageHeader title="التحليلات المتقدمة" back="/reports" />
      <Card className="mb-4">معدل النجاح التقريبي: {rate}%</Card>
      <div className="space-y-2">
        <RowLink href="/reports/today" icon="✅" title="تحليل معدل النجاح" />
        <RowLink href="/reports/weekly" icon="⚡" title="تحليل الأداء والسرعة" />
        <RowLink href="/security/reports" icon="🛡️" title="تحليل الأمان والحماية" />
        <RowLink href="/settings/about" icon="💻" title="تحليل الموارد" />
        <RowLink href="/reports/accounts" icon="🎯" title="تحليل الاستهداف" />
      </div>
    </div>
  );
}
