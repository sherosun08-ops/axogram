"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="إشعارات البروكسي" back="/proxy" />
      <SettingsForm back="/proxy" title="pa" success="تم حفظ الإشعارات" keys={[
        { key: "px_alert_dead", label: "موت بروكسي معيَّن", type: "toggle" },
        { key: "px_alert_slow", label: "ارتفاع الكمون", type: "toggle" },
        { key: "px_alert_fail", label: "فشل فحص دوري", type: "toggle" },
      ]} />
    </div>
  );
}
