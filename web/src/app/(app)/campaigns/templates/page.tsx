"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { Feedback, useOp } from "@/components/prod";
export default function Page() {
  const { data, loading, reload } = useApi<{ templates: any[] }>("/api/templates");
  const op = useOp();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  if (loading) return <LoadingGrid />;
  const items = (data?.templates || []).filter((t) => t.kind === "campaign");
  return (
    <div>
      <PageHeader title="قوالب رسائل القروبات" back="/campaigns" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="mb-4 space-y-2">
        <Field label="اسم القالب"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="النص"><Textarea value={content} onChange={(e) => setContent(e.target.value)} /></Field>
        <Button disabled={!name} onClick={async () => { await op.run("create_template", { kind: "campaign", name, content }); setName(""); reload(); op.setMsg("تم الحفظ"); }}>حفظ</Button>
      </Card>
      {items.map((t) => <Card key={t.id} className="mb-2"><div className="font-bold">{t.name}</div><div className="text-sm">{t.content}</div></Card>)}
    </div>
  );
}
