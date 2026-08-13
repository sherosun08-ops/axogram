"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="إعدادات حملات القروبات" back="/campaigns" />
      <SettingsForm back="/campaigns" title="cs" success="تم حفظ الإعدادات" keys={[
        { key: "daily_campaign_limit", label: "حد يومي", type: "number" },
        { key: "camp_delay", label: "تأخير بين القروبات (ث)", type: "number" },
      ]} />
    </div>
  );
}
