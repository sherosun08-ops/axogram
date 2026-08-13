"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [raw, setRaw] = useState("");
  const [target, setTarget] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const label: any = { ok: "✅ صالح", black: "🚫 سوداء", bot: "🤖 بوت", missing: "❌ غير موجود" };
  return (
    <div>
      <PageHeader title="إضافة يدوية" back="/adder" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="المعرفات — سطر لكل عضو"><Textarea value={raw} onChange={(e) => setRaw(e.target.value)} /></Field>
        <Field label="القروب الهدف"><Input value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
        <Button variant="ghost" disabled={!raw || op.busy} onClick={async () => setResults((await op.run("verify_members", { raw }) as any).results)}>تحقق فوري</Button>
        {results && results.map((r) => <div key={r.value} className="text-sm">{label[r.status]} {r.value}</div>)}
        <Button className="w-full" disabled={!target || !raw || op.busy} onClick={async () => {
          const r: any = await op.run("start_add", { target, raw, total: raw.split("\n").filter(Boolean).length, title: "إضافة يدوية" });
          router.push(`/reports/live/${r.job.id}`);
        }}>إضافة الصالحين</Button>
      </Card>
    </div>
  );
}
