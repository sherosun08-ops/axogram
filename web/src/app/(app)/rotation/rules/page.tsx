"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="قواعد الاستبعاد التلقائي" back="/rotation" />
      <SettingsForm back="/rotation" title="rr" success="تم حفظ القواعد" keys={[
        { key: "ex_flood", label: "استبعاد عند FloodWait متكرر", type: "toggle" },
        { key: "ex_conn", label: "استبعاد عند فشل اتصال", type: "toggle" },
        { key: "ex_health", label: "استبعاد عند انخفاض الصحة تحت 50", type: "toggle" },
        { key: "ex_flood_n", label: "عدد FloodWait قبل الاستبعاد", type: "number" },
      ]} />
    </div>
  );
}
