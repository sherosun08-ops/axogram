"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="الجدولة التلقائية العامة" back="/settings" />
      <SettingsForm back="/settings" title="sch" success="تم حفظ الجدولة التلقائية" keys={[
        { key: "sched_reset", label: "تصفير العدادات يومياً", type: "toggle" },
        { key: "sched_reset_time", label: "وقت التصفير" },
        { key: "sched_health", label: "فحص صحة الحسابات يومياً", type: "toggle" },
        { key: "sched_health_time", label: "وقت الفحص" },
        { key: "sched_backup", label: "نسخ احتياطي تلقائي", type: "toggle" },
        { key: "sched_backup_time", label: "وقت النسخ" },
        { key: "sched_cleanup", label: "تنظيف الملفات القديمة تلقائياً", type: "toggle" },
      ]} />
    </div>
  );
}
