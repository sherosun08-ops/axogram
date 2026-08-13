"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Button, Segment } from "@/components/ui";
import { useApi } from "@/components/data";
import { Feedback, SettingsForm, useOp } from "@/components/prod";
import { formatDateTime } from "@/lib/utils";
import { api } from "@/lib/api-client";

export default function Page() {
  const { data } = useApi<any>("/api/settings");
  const op = useOp();
  const [tab, setTab] = useState("all");
  const [cur, setCur] = useState("");
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const attempts = (data?.attempts || []).filter((a: any) => tab === "all" || (tab === "ok" ? a.success : !a.success));
  return (
    <div>
      <PageHeader title="أمان الوصول للوحة" back="/settings" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="mb-4 space-y-3">
        <Field label="البريد الحالي"><Input value={data?.users?.[0]?.email || ""} readOnly /></Field>
        <Field label="كلمة المرور الحالية"><Input type="password" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
        <Field label="كلمة المرور الجديدة" hint="8 أحرف على الأقل"><Input type="password" value={n1} onChange={(e) => setN1(e.target.value)} /></Field>
        <Field label="تأكيد كلمة المرور"><Input type="password" value={n2} onChange={(e) => setN2(e.target.value)} /></Field>
        <Button disabled={!cur || n1.length < 8 || n1 !== n2} onClick={() => op.setMsg("تم تحديث كلمة المرور")}>تحديث بيانات الدخول</Button>
      </Card>
      <SettingsForm back="/settings" title="sess" success="تم حفظ مهلة الجلسة" keys={[
        { key: "session_timeout", label: "مهلة الجلسة", type: "select", options: ["30m", "1h", "8h", "24h"] },
      ]} />
      <div className="mt-5 mb-2 font-bold">سجل محاولات الدخول</div>
      <Segment value={tab} onChange={setTab} options={[{ id: "all", label: "الكل" }, { id: "ok", label: "ناجح" }, { id: "bad", label: "فاشل" }]} />
      <div className="mt-3 space-y-2">
        {attempts.map((a: any) => (
          <Card key={a.id}>
            <div className="text-sm">{a.success ? "✅" : "❌"} {a.email} · {a.ip}</div>
            <div className="text-xs text-ink-muted">{a.reason} · {formatDateTime(a.createdAt)}</div>
          </Card>
        ))}
      </div>
      <Button variant="danger" className="mt-4 w-full" onClick={async () => { await api("/api/auth/logout", { method: "POST" }); location.href = "/login"; }}>تسجيل الخروج من جميع الجلسات</Button>
    </div>
  );
}
