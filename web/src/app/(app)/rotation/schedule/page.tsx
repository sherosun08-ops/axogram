"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="جدولة دوام الدورة" back="/rotation" />
      <SettingsForm back="/rotation" title="rs" success="تم حفظ الجدول" keys={[
        { key: "work_from", label: "من" },
        { key: "work_to", label: "إلى" },
        { key: "work_stop", label: "إيقاف خارج الدوام", type: "toggle" },
      ]} />
    </div>
  );
}
