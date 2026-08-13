"use client";
import { PageHeader, Banner } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="مسارات التخزين" back="/settings" />
      <Banner tone="info">يُختبر كل مسار للكتابة قبل الحفظ</Banner>
      <SettingsForm back="/settings" title="paths" success="تم حفظ المسارات" keys={[
        { key: "path_sessions", label: "مسار الجلسات" },
        { key: "path_exports", label: "مسار الملفات المُصدَّرة" },
        { key: "path_logs", label: "مسار السجلات" },
        { key: "path_backups", label: "مسار النسخ الاحتياطي" },
        { key: "path_templates", label: "مسار القوالب" },
      ]} />
    </div>
  );
}
