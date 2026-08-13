"use client";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi } from "@/components/data";
import { LogList } from "@/components/prod";

export default function Page() {
  const { data } = useApi<any>("/api/reports");
  const banned = (data?.accounts || []).filter((a: any) => ["banned", "frozen", "restricted_temp", "restricted_perm"].includes(a.status));
  return (
    <div>
      <PageHeader title="تقارير الأمان" back="/security" />
      <Card className="mb-4">
        <div className="font-bold">حسابات تحتاج مراجعة: {banned.length}</div>
        {banned.map((a: any) => <div key={a.id} className="text-sm">{a.firstName} — {a.status}</div>)}
      </Card>
      <LogList type="security" />
    </div>
  );
}
