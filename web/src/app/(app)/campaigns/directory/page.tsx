"use client";
import { useState } from "react";
import { PageHeader, Card, Input, Button, Field, Select } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
export default function Page() {
  const { data, loading, reload } = useApi<{ groups: any[] }>("/api/directory");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [type, setType] = useState("public");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="دليل القروبات" back="/campaigns" />
      <Card className="mb-4 space-y-2">
        <Field label="الاسم"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="المعرف"><Input value={username} onChange={(e) => setUsername(e.target.value)} /></Field>
        <Field label="النوع"><Select value={type} onChange={(e) => setType(e.target.value)}><option value="public">عام</option><option value="private">خاص</option><option value="channel">قناة</option></Select></Field>
        <Button disabled={!title} onClick={async () => { await api("/api/directory", { method: "POST", body: JSON.stringify({ title, username, type }) }); setTitle(""); setUsername(""); reload(); }}>إضافة للدليل</Button>
      </Card>
      {(data?.groups || []).map((g) => (
        <Card key={g.id} className="mb-2">
          <div className="font-bold">{g.title}</div>
          <div className="text-sm text-ink-muted">{g.username || g.inviteLink} · {g.members} عضو · {g.type}</div>
        </Card>
      ))}
    </div>
  );
}
