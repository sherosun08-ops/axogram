"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="إشعارات التدوير" back="/rotation" />
      <SettingsForm back="/rotation" title="ra" success="تم حفظ الإشعارات" keys={[
        { key: "rot_alert_switch", label: "تنبيه عند تبديل الحساب", type: "toggle" },
        { key: "rot_alert_empty", label: "تنبيه عند استنفاد الدورة", type: "toggle" },
        { key: "rot_alert_ex", label: "تنبيه عند استبعاد حساب", type: "toggle" },
      ]} />
    </div>
  );
}
