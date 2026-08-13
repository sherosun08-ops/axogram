"use client";
import { PageHeader, Banner } from "@/components/ui";
import { SettingsForm } from "@/components/prod";
export default function Page() {
  return (
    <div>
      <PageHeader title="الأداء" back="/settings" />
      <Banner tone="info">التغييرات تؤثر على الاتصالات الجديدة فقط</Banner>
      <SettingsForm back="/settings" title="p" success="تم حفظ إعدادات الأداء" keys={[
        { key: "concurrency", label: "عمليات متزامنة (1–10)", type: "number", hint: "أكثر من 5 يستهلك موارد كثيرة" },
        { key: "cache_mb", label: "حجم Cache MB", type: "number" },
        { key: "request_timeout", label: "مهلة الطلبات (ثانية)", type: "number" },
        { key: "retries", label: "محاولات إعادة الطلب", type: "number" },
      ]} />
    </div>
  );
}
