"use client";
import { PageHeader, Card, Button } from "@/components/ui";
import { LogList, SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="إعدادات التسجيل" back="/settings" />
      <SettingsForm back="/settings" title="l" success="تم حفظ التسجيل" keys={[
        { key: "log_level", label: "مستوى التسجيل", type: "select", options: ["error", "warning", "info", "debug"] },
        { key: "log_gzip", label: "ضغط الملفات القديمة", type: "toggle" },
        { key: "log_days", label: "حذف بعد (يوم)", type: "number" },
      ]} />
      <div className="mt-5 font-bold text-navy mb-2">آخر الأحداث</div>
      <LogList />
    </div>
  );
}
