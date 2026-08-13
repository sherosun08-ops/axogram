"use client";
import Link from "next/link";
import { PageHeader, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";

export default function Groups() {
  const { data, loading } = useApi<{ groups: any[] }>("/api/accounts/groups");
  if (loading) return <LoadingGrid />;
  const groups = data?.groups || [];
  return (
    <div>
      <PageHeader title="مجموعات الحسابات" back="/accounts" actions={<Link href="/accounts/groups/new" className="btn-primary">+ جديد</Link>} />
      <div className="space-y-2">
        {groups.map((g) => {
          const health = g.accounts?.length ? Math.round(g.accounts.reduce((s:number,a:any)=>s+a.healthScore,0)/g.accounts.length) : 0;
          const active = g.accounts?.filter((a:any)=>["active","premium"].includes(a.status)).length || 0;
          return (
            <Link key={g.id} href={`/accounts/groups/${g.id}`} className="card block p-4">
              <div className="font-bold text-navy">{g.name}</div>
              <div className="text-sm text-ink-muted">الغرض: {g.purpose} · {g.accounts?.length||0} حساب · {active} نشط · صحة {health}%</div>
            </Link>
          );
        })}
        {groups.length===0 && <Empty icon="👥" title="لا مجموعات بعد" action={<Link href="/accounts/groups/new" className="btn-primary">إنشاء مجموعة</Link>} />}
      </div>
    </div>
  );
}
