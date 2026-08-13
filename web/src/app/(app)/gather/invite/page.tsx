"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Banner } from "@/components/ui";
import { AccountSelect, Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [link, setLink] = useState("");
  const [info, setInfo] = useState<any>(null);
  const [leave, setLeave] = useState(true);
  const [accountId, setAccountId] = useState("");
  return (
    <div>
      <PageHeader title="تجميع من رابط دعوة خاص" back="/gather" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="رابط الدعوة" hint="t.me/+xxxxx"><Input value={link} onChange={(e) => setLink(e.target.value)} /></Field>
        <Button disabled={!link || op.busy} onClick={async () => setInfo((await op.run("analyze_group", { link }) as any).group)}>تحليل الرابط</Button>
        {info && (
          <>
            <div className="rounded-xl bg-slate-50 p-3 text-sm">{info.title} · {info.members} عضو · {info.type}</div>
            <Banner tone="info">سينضم الحساب ثم يجمع ثم يغادر اختيارياً</Banner>
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={leave} onChange={(e) => setLeave(e.target.checked)} /> المغادرة بعد الانتهاء</label>
            <AccountSelect value={accountId} onChange={setAccountId} />
            <Button className="w-full" disabled={op.busy} onClick={async () => {
              const r: any = await op.run("start_gather", { link, leave, accountId, source: info.title, limit: Math.min(info.members, 2000) });
              router.push(`/reports/live/${r.job.id}`);
            }}>بدء التجميع</Button>
          </>
        )}
      </Card>
    </div>
  );
}
