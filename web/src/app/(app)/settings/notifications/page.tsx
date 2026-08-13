"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="إشعارات النظام" back="/settings" />
      <SettingsForm back="/settings" title="n" success="تم حفظ إعدادات الإشعارات" keys={[
        { key: "notify_enabled", label: "تفعيل الإشعارات", type: "toggle" },
        { key: "notify_target", label: "وجهة الإشعارات (@username أو قروب)" },
        { key: "notify_ban", label: "حظر / محظور نهائياً", type: "toggle" },
        { key: "notify_restrict", label: "تقييد مؤقت", type: "toggle" },
        { key: "notify_job_done", label: "اكتمال عملية", type: "toggle" },
        { key: "notify_proxy_dead", label: "موت بروكسي معيَّن", type: "toggle" },
        { key: "notify_daily", label: "تقرير يومي", type: "toggle" },
        { key: "notify_daily_time", label: "وقت التقرير اليومي" },
      ]} />
    </div>
  );
}
