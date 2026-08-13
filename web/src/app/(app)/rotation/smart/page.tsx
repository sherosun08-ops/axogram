"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="التدوير الذكي المتقدم" back="/rotation" />
      <SettingsForm back="/rotation" title="sm" success="تم حفظ قواعد الذكاء" keys={[
        { key: "smart_health", label: "تفضيل الأعلى صحة", type: "toggle" },
        { key: "smart_least", label: "تفضيل الأقل استهلاكاً", type: "toggle" },
        { key: "smart_avoid_flood", label: "تجنب من لديه FloodWait حديث", type: "toggle" },
        { key: "smart_health_weight", label: "وزن الصحة %", type: "number" },
      ]} />
    </div>
  );
}
