"use client";
import { useEffect, useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const { data, loading } = useApi<any>("/api/rotation");
  const op = useOp();
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => { if (data?.slots) setIds(data.slots.map((s: any) => s.id)); }, [data]);
  function move(i: number, dir: number) {
    const n = [...ids];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    setIds(n);
  }
  if (loading) return <LoadingGrid />;
  const map = Object.fromEntries((data?.slots || []).map((s: any) => [s.id, s]));
  return (
    <div>
      <PageHeader title="تعديل الترتيب" back="/rotation" />
      <Feedback err={op.err} msg={op.msg} />
      <div className="space-y-2">
        {ids.map((id, i) => (
          <Card key={id} className="flex items-center justify-between">
            <span className="font-semibold">{i + 1}. {map[id]?.account?.firstName}</span>
            <span className="flex gap-1">
              <Button variant="ghost" onClick={() => move(i, -1)}>↑</Button>
              <Button variant="ghost" onClick={() => move(i, 1)}>↓</Button>
            </span>
          </Card>
        ))}
      </div>
      <Button className="mt-4 w-full" onClick={async () => { await op.run("reorder_rotation", { ids }); op.setMsg("تم حفظ الترتيب"); }}>حفظ الترتيب</Button>
    </div>
  );
}
