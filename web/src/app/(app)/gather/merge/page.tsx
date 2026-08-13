"use client";
import { useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi } from "@/components/data";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const { data } = useApi<{ files: any[] }>("/api/files");
  const op = useOp();
  const [ids, setIds] = useState<string[]>([]);
  function tog(id: string) { setIds((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]); }
  return (
    <div>
      <PageHeader title="دمج ملفات" back="/gather" />
      <Feedback err={op.err} msg={op.msg} />
      <div className="space-y-2 mb-3">
        {(data?.files || []).map((f) => (
          <label key={f.id} className="card flex gap-3 p-3 text-sm">
            <input type="checkbox" checked={ids.includes(f.id)} onChange={() => tog(f.id)} />
            <span>{f.name} · {f.membersCount}</span>
          </label>
        ))}
      </div>
      <Button className="w-full" disabled={ids.length < 2 || op.busy} onClick={async () => {
        const r: any = await op.run("merge_files", { ids });
        op.setMsg(`تم إنشاء ${r.file.name} — ${r.merged} بعد إزالة التكرار من ${r.raw}`);
      }}>دمج</Button>
    </div>
  );
}
