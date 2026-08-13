"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="إعدادات البروكسي العامة" back="/proxy" />
      <SettingsForm back="/proxy" title="ps" success="تم حفظ إعدادات البروكسي" keys={[
        { key: "px_interval", label: "فترة الفحص الدوري بالدقائق", type: "number" },
        { key: "px_force", label: "إجبار بروكسي على كل حساب", type: "toggle" },
        { key: "px_timeout", label: "مهلة الاختبار بالثواني", type: "number" },
      ]} />
    </div>
  );
}
