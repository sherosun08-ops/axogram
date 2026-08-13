"use client";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Button, Banner } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  return (
    <div>
      <PageHeader title="تنظيف الحسابات" back="/security" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> مغادرة قروبات قديمة</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" /> حذف رسائل محفوظة</label>
        <Banner tone="warning">لا يمكن مغادرة قروب أنت منشئه</Banner>
        <Button className="w-full" disabled={op.busy} onClick={async () => {
          const r: any = await op.run("cleanup_account", { count: 25 });
          router.push(`/reports/live/${r.job.id}`);
        }}>بدء التنظيف</Button>
      </Card>
    </div>
  );
}
