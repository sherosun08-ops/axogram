"use client";
import { useState } from "react";
import { PageHeader, Card, Segment, Button, Empty } from "@/components/ui";
import { useApi } from "@/components/data";
import { formatDateTime } from "@/lib/utils";

export default function Page() {
  const { data } = useApi<any>("/api/settings");
  const [tab, setTab] = useState("all");
  const items = (data?.attempts || []).filter((a: any) => tab === "all" || (tab === "ok" ? a.success : !a.success));
  return (
    <div>
      <PageHeader title="سجل محاولات الدخول" back="/settings" />
      <Segment value={tab} onChange={setTab} options={[{ id: "all", label: "الكل" }, { id: "ok", label: "ناجح" }, { id: "bad", label: "فاشل" }]} />
      <div className="mt-3 space-y-2">
        {items.map((a: any) => (
          <Card key={a.id}>
            <div className="font-semibold">{a.success ? "✅ ناجح" : "❌ فاشل"} · {a.ip}</div>
            <div className="text-sm text-ink-muted">{a.email} · {a.reason} · {a.userAgent} · {formatDateTime(a.createdAt)}</div>
          </Card>
        ))}
        {items.length === 0 && <Empty title="لا محاولات في هذه الفترة" />}
      </div>
    </div>
  );
}
