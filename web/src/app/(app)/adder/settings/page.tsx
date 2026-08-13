"use client";
import { PageHeader, Banner } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="إعدادات الإضافة الافتراضية" back="/adder" />
      <Banner tone="warning">أكثر من 50 إضافة/يوم عدواني ويزيد خطر PeerFlood</Banner>
      <SettingsForm back="/adder" title="as" success="تم حفظ إعدادات الإضافة" keys={[
        { key: "daily_add_limit", label: "حد الإضافة اليومي", type: "number" },
        { key: "delay_min", label: "التأخير الأدنى بالثواني", type: "number" },
        { key: "delay_max", label: "التأخير الأقصى", type: "number" },
        { key: "add_skip_exist", label: "تخطي الموجودين في القروب", type: "toggle" },
        { key: "add_black_privacy", label: "إضافة للسوداء عند خصوصية مغلقة", type: "toggle" },
      ]} />
    </div>
  );
}
