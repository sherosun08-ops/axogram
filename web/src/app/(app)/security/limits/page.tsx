"use client";
import { PageHeader, Banner } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="الحدود الذكية" back="/security" />
      <Banner tone="info">حساب أقل من 30 يوماً: 10/يوم · 1–6 أشهر: 20/يوم · أكبر: 35/يوم · Premium مع هامش</Banner>
      <SettingsForm back="/security" title="sl" success="تم تطبيق الحدود الذكية" keys={[
        { key: "smart_limits", label: "تفعيل الحدود الذكية", type: "toggle" },
        { key: "smart_new", label: "حد الحساب الجديد (أقل من 30 يوماً)", type: "number" },
        { key: "smart_mid", label: "حد 1–6 أشهر", type: "number" },
        { key: "smart_old", label: "حد أكبر من 6 أشهر", type: "number" },
      ]} />
    </div>
  );
}
