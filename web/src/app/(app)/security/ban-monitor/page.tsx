"use client";
import { PageHeader, Card, Banner } from "@/components/ui";
import { useApi } from "@/components/data";
import { SettingsForm } from "@/components/prod";

export default function Page() {
  const { data } = useApi<any>("/api/accounts");
  const hot = (data?.accounts || []).filter((a: any) => ["banned", "frozen", "restricted_temp"].includes(a.status));
  return (
    <div>
      <PageHeader title="مراقب الحظر الحي" back="/security" />
      {hot.length > 0 && <Banner tone="danger">{hot.length} حساب في حالة حظر/تقييد/تجميد</Banner>}
      <div className="mb-4 space-y-2">
        {hot.map((a: any) => <Card key={a.id}>{a.firstName} {a.lastName} · {a.status}</Card>)}
      </div>
      <SettingsForm back="/security" title="bm" success="المراقب يعمل" keys={[
        { key: "ban_alert", label: "تنبيه فوري عند الحظر", type: "toggle" },
        { key: "ban_stop", label: "إيقاف العمليات المرتبطة", type: "toggle" },
      ]} />
    </div>
  );
}
