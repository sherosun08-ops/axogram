"use client";
import Link from "next/link";
import { PageHeader, Card } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Page() {
  const { data, loading } = useApi<any>("/api/accounts");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="تقارير الحسابات" back="/reports" />
      <div className="space-y-2">
        {(data?.accounts || []).map((a: any) => (
          <Link key={a.id} href={`/accounts/${a.id}`} className="card block p-4">
            <div className="font-bold">{a.firstName} {a.lastName}</div>
            <div className="text-sm text-ink-muted">{a.status} · صحة {a.healthScore}% · إضافة {a.usedAdd} · تجميع {a.usedGather} · DM {a.usedDm}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
