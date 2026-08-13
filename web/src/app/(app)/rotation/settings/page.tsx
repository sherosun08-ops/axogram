"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="إعدادات التدوير" back="/rotation" />
      <SettingsForm back="/rotation" title="r" success="تم حفظ إعدادات التدوير" keys={[
        { key: "rot_mode", label: "الوضع", type: "select", options: ["smart", "sequential", "random", "manual"] },
        { key: "switch_after", label: "التبديل بعد N عملية", type: "number" },
        { key: "rest_after", label: "راحة بعد N عملية", type: "number" },
        { key: "rest_minutes", label: "مدة الراحة بالدقائق", type: "number" },
      ]} />
    </div>
  );
}
