"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Button, Empty } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [q, setQ] = useState("تسويق");
  const [results, setResults] = useState<any[] | null>(null);
  return (
    <div>
      <PageHeader title="بحث متقدم واكتشاف قروبات" back="/gather" />
      <Feedback err={op.err} />
      <div className="mb-3 flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="كلمات البحث" />
        <Button disabled={op.busy} onClick={async () => setResults((await op.run("discover_groups", { q }) as any).results)}>بحث</Button>
      </div>
      <div className="space-y-2">
        {results?.map((g) => (
          <Card key={g.title}>
            <div className="font-bold">{g.title}</div>
            <div className="text-sm text-ink-muted">{g.username || "خاص"} · {g.members.toLocaleString("ar-SA")} · {g.type}</div>
          </Card>
        ))}
        {results && !results.length && <Empty title="لا نتائج" />}
      </div>
    </div>
  );
}
