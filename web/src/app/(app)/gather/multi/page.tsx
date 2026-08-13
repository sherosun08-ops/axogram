"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Textarea, Button } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const [raw, setRaw] = useState("");
  const [analyzed, setAnalyzed] = useState<any[] | null>(null);
  return (
    <div>
      <PageHeader title="استخراج جماعي من عدة قروبات" back="/gather" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="روابط القروبات — سطر لكل قروب"><Textarea value={raw} onChange={(e) => setRaw(e.target.value)} /></Field>
        <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> تخطي القروبات المخفية</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> إزالة التكرار بين القروبات</label>
        <Button variant="ghost" disabled={op.busy} onClick={async () => {
          const lines = raw.split("\n").map((s) => s.trim()).filter(Boolean);
          const out = [];
          for (const link of lines) out.push((await op.run("analyze_group", { link }) as any).group);
          setAnalyzed(out);
        }}>تحليل الكل</Button>
        {analyzed && (
          <>
            {analyzed.map((g, i) => <div key={i} className="text-sm">{g.hidden ? "⚠️" : "✅"} {g.title} · {g.members}</div>)}
            <Button className="w-full" onClick={async () => {
              const r: any = await op.run("start_gather", { type: "multi", limit: analyzed.reduce((s, g) => s + Math.min(g.members, 1500), 0), links: raw });
              router.push(`/reports/live/${r.job.id}`);
            }}>بدء التجميع الجماعي</Button>
          </>
        )}
      </Card>
    </div>
  );
}
