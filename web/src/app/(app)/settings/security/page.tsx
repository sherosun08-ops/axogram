"use client";
import { PageHeader, Banner } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="الأمان والحماية العامة" back="/settings" />
      <Banner tone="warning">المستوى العدواني يزيد خطر FloodWait و PeerFlood</Banner>
      <SettingsForm back="/settings" title="s" success="تم حفظ إعدادات الأمان" keys={[
        { key: "security_level", label: "مستوى الأمان", type: "select", options: ["conservative", "balanced", "aggressive"] },
        { key: "on_flood", label: "عند FloodWait", type: "select", options: ["wait", "switch", "stop"] },
        { key: "on_ban", label: "عند حظر حساب", type: "select", options: ["remove_continue", "stop_notify"] },
        { key: "fail_stop_percent", label: "حد إيقاف الفشل %", type: "number" },
      ]} />
    </div>
  );
}
