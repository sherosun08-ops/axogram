"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";
import { api } from "@/lib/api-client";
import { useApi } from "@/components/data";

export default function Page() {
  const router = useRouter();
  const op = useOp();
  const { data } = useApi<{ groups: any[] }>("/api/directory");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [ids, setIds] = useState<string[]>([]);
  return (
    <div>
      <PageHeader title="إنشاء حملة قروبات" back="/campaigns" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="اسم الحملة"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="الرسالة"><Textarea value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
        <div className="font-semibold text-sm">القروبات المستهدفة</div>
        {(data?.groups || []).map((g) => (
          <label key={g.id} className="flex gap-2 text-sm">
            <input type="checkbox" checked={ids.includes(g.id)} onChange={() => setIds((s) => s.includes(g.id) ? s.filter((x) => x !== g.id) : [...s, g.id])} />
            {g.title} ({g.members})
          </label>
        ))}
        <Button className="w-full" disabled={!name || !message} onClick={async () => {
          await api("/api/campaigns", { method: "POST", body: JSON.stringify({ kind: "groups", name, message, targetsCount: ids.length || 10, status: "draft" }) });
          router.push("/campaigns/list");
        }}>حفظ</Button>
      </Card>
    </div>
  );
}
