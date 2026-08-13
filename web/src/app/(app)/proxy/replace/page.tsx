"use client";
import { PageHeader, Card, Button, Banner } from "@/components/ui";
import { useApi } from "@/components/data";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const { data } = useApi<{ proxies: any[] }>("/api/proxies");
  const op = useOp();
  const dead = (data?.proxies || []).filter((p) => p.status === "dead" && p.accounts?.length);
  return (
    <div>
      <PageHeader title="استبدال الميتة" back="/proxy" />
      <Feedback err={op.err} msg={op.msg} />
      <Banner tone="info">يستبدل كل بروكسي ميت ومعيَّن بآخر حي</Banner>
      <Card className="mb-3">
        <div className="font-bold">{dead.length} بروكسي ميت ومعيَّن</div>
        {dead.map((p) => <div key={p.id} className="text-sm">{p.host}:{p.port} · {p.accounts.length} حساب</div>)}
      </Card>
      <Button className="w-full" disabled={op.busy} onClick={async () => {
        const r: any = await op.run("replace_dead", {});
        op.setMsg(`تم استبدال ${r.replaced} تعيين`);
      }}>استبدال الآن</Button>
    </div>
  );
}
