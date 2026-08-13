"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Button, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const { data, loading, reload } = useApi<{ templates: any[] }>("/api/templates");
  const op = useOp();
  const [name, setName] = useState("");
  if (loading) return <LoadingGrid />;
  const items = (data?.templates || []).filter((t) => t.kind === "gather");
  return (
    <div>
      <PageHeader title="قوالب التجميع" back="/gather" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="mb-4 space-y-2">
        <Field label="اسم قالب جديد"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Button disabled={!name} onClick={async () => { await op.run("create_template", { kind: "gather", name, content: JSON.stringify({ type: "public" }) }); setName(""); reload(); op.setMsg("تم حفظ القالب"); }}>حفظ القالب</Button>
      </Card>
      <div className="space-y-2">
        {items.map((t) => <Card key={t.id}><div className="font-bold">{t.name}</div><div className="text-xs text-ink-muted">{t.content}</div></Card>)}
        {items.length === 0 && <Empty title="لا قوالب" />}
      </div>
    </div>
  );
}
