"use client";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="المجموعة الاحتياطية" back="/rotation" subtitle="عند فراغ الدورة تُفعَّل مجموعة احتياطية تلقائياً" />
      <SettingsForm back="/rotation" title="bg" success="تم تعيين المجموعة الاحتياطية" keys={[
        { key: "backup_group", label: "اسم المجموعة الاحتياطية" },
        { key: "backup_auto_return", label: "العودة التلقائية للمجموعة الأساسية", type: "toggle" },
      ]} />
    </div>
  );
}
