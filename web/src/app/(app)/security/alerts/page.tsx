"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="تنبيهات الأمان" back="/security" />
      <SettingsForm back="/security" title="sa" success="تم حفظ التنبيهات" keys={[
        { key: "sec_alert_ban", label: "حظر", type: "toggle" },
        { key: "sec_alert_freeze", label: "تجميد", type: "toggle" },
        { key: "sec_alert_dead", label: "جلسة ميتة", type: "toggle" },
        { key: "sec_alert_ip", label: "دخول من IP جديد", type: "toggle" },
      ]} />
    </div>
  );
}
