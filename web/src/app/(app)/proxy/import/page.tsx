"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Textarea, Button, Select } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [raw, setRaw] = useState("");
  const [type, setType] = useState("socks5");
  const [test, setTest] = useState(true);
  const [res, setRes] = useState<any>(null);
  return (
    <div>
      <PageHeader title="استيراد قائمة بروكسي" back="/proxy" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="space-y-3">
        <Field label="القائمة — سطر لكل بروكسي host:port:user:pass"><Textarea value={raw} onChange={(e) => setRaw(e.target.value)} /></Field>
        <Field label="النوع"><Select value={type} onChange={(e) => setType(e.target.value)}><option value="socks5">SOCKS5</option><option value="http">HTTP</option></Select></Field>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={test} onChange={(e) => setTest(e.target.checked)} /> اختبار قبل الحفظ</label>
        <Button className="w-full" disabled={!raw || op.busy} onClick={async () => {
          const r = await op.run("import_proxies", { raw, type, test });
          setRes(r);
          op.setMsg(`أُضيف ${r.added} بروكسي`);
        }}>استيراد</Button>
        {res && <div className="text-sm">أُضيف {res.added}</div>}
      </Card>
    </div>
  );
}
