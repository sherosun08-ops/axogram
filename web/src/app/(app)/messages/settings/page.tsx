"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="إعدادات الرسائل" back="/messages" />
      <SettingsForm back="/messages" title="ms" success="تم حفظ إعدادات الرسائل" keys={[
        { key: "daily_dm_limit", label: "حد يومي", type: "number" },
        { key: "dm_delay", label: "تأخير بين الرسائل (ث)", type: "number" },
        { key: "dm_stop_flood", label: "توقف عند PeerFlood", type: "toggle" },
      ]} />
    </div>
  );
}
