"use client";

import { PageHeader, Banner } from "@/components/ui";
import { SettingsForm } from "@/components/prod";

export default function Limits() {
  return (
    <div>
      <PageHeader title="الحدود الافتراضية اليومية" back="/settings" subtitle="تُورَّث لكل عملية جديدة — يمكن تخصيصها لكل حساب" />
      <Banner tone="info">حساب أقل من 30 يوماً: 10/يوم · 1–6 أشهر: 20 · أكبر: 35 · Premium بهامش</Banner>
      <SettingsForm
        title="الحدود"
        back="/settings"
        success="تم حفظ الحدود الافتراضية"
        keys={[
          { key: "daily_add_limit", label: "حد الإضافة / حساب", type: "number", hint: "20–30 موصى بها — أكثر من 50 خطر PeerFlood" },
          { key: "daily_gather_limit", label: "حد التجميع / حساب", type: "number", hint: "أكثر من 1000 يزيد FloodWait" },
          { key: "daily_dm_limit", label: "حد الرسائل DM / حساب", type: "number" },
          { key: "daily_campaign_limit", label: "حد حملات القروبات / حساب", type: "number" },
          { key: "delay_min", label: "التأخير الأدنى (ثانية)", type: "number" },
          { key: "delay_max", label: "التأخير الأقصى (ثانية)", type: "number" },
          { key: "switch_after", label: "عمليات قبل التبديل", type: "number" },
          { key: "rest_after", label: "راحة بعد كل N عملية", type: "number" },
          { key: "rest_minutes", label: "مدة الراحة (دقيقة)", type: "number" },
          { key: "smart_limits", label: "تفعيل الحدود الذكية", type: "toggle" },
        ]}
      />
    </div>
  );
}
