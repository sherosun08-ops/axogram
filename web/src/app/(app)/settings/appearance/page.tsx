"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="اللغة والمظهر والمنطقة الزمنية" back="/settings" subtitle="التخزين دائماً UTC — العرض يتحول للمنطقة" />
      <SettingsForm back="/settings" title="a" success="تم تحديث المظهر" keys={[
        { key: "language", label: "اللغة", type: "select", options: ["ar", "en"] },
        { key: "timezone", label: "المنطقة الزمنية", type: "select", options: ["Asia/Riyadh", "Asia/Aden", "Asia/Dubai", "Africa/Cairo", "Europe/London"] },
        { key: "time_format", label: "تنسيق الوقت", type: "select", options: ["24", "12"] },
        { key: "date_format", label: "تنسيق التاريخ", type: "select", options: ["YYYY/MM/DD", "DD/MM/YYYY", "MM/DD/YYYY"] },
      ]} />
    </div>
  );
}
