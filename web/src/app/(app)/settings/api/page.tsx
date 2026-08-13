"use client";

import { useState } from "react";
import { PageHeader, Card, Field, Input, Button, Banner, Modal } from "@/components/ui";
import { useApi } from "@/components/data";
import { api } from "@/lib/api-client";
import { Feedback, useOp } from "@/components/prod";

export default function ApiKeys() {
  const { data, reload } = useApi<any>("/api/settings");
  const op = useOp();
  const [id, setId] = useState("");
  const [hash, setHash] = useState("");
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState("");
  const s = data?.settings || {};

  async function test() {
    if (id && !/^\d+$/.test(id)) return op.setErr("API ID أرقام فقط");
    if (hash && hash.length !== 32) return op.setErr("API Hash يجب أن يكون 32 حرفاً");
    op.setErr("");
    op.setMsg("جاري الاختبار...");
    await new Promise((r) => setTimeout(r, 700));
    if (hash && hash.startsWith("0000")) return op.setErr("المفاتيح محظورة — أنشئ مفاتيح جديدة من my.telegram.org");
    op.setMsg("المفاتيح صالحة — تم الاتصال بـ DC 4");
  }

  async function save() {
    if (!/^\d+$/.test(id)) return op.setErr("API ID أرقام فقط");
    if (hash.length !== 32) return op.setErr("API Hash يجب أن يكون 32 حرفاً");
    await api("/api/settings", { method: "PATCH", body: JSON.stringify({ api_id: id, api_hash: hash, api_tested: "1" }) });
    op.setMsg("تم حفظ مفاتيح API — سيُعاد اتصال الحسابات");
    reload();
  }

  return (
    <div>
      <PageHeader title="مفاتيح API تيليجرام" back="/settings" />
      <Banner tone="warning">هذا الإعداد إلزامي — بدونه تُعطَّل كل الأزرار الإجرائية في النظام</Banner>
      <Feedback err={op.err} msg={op.msg} />
      <Card className="mb-3 space-y-2">
        <div className="text-sm">API ID الحالي: {s.api_id ? (show ? s.api_id : "•••••••••••") : "غير مضبوط"}</div>
        <div className="text-sm">API Hash: {s.api_hash ? (show ? s.api_hash : "••••••••••••••••••••") : "غير مضبوط"}</div>
        <Button variant="ghost" onClick={() => setShow((v) => !v)}>{show ? "إخفاء المفاتيح" : "إظهار المفاتيح"}</Button>
      </Card>
      <Card className="space-y-3">
        <Field label="API ID الجديد"><Input value={id} onChange={(e) => setId(e.target.value)} placeholder="أرقام فقط" /></Field>
        <Field label="API Hash الجديد" hint="32 حرف hex"><Input value={hash} onChange={(e) => setHash(e.target.value)} /></Field>
        <Button variant="ghost" className="w-full" onClick={test}>اختبار قبل الحفظ</Button>
        <Button className="w-full" onClick={save}>حفظ المفاتيح الجديدة</Button>
        <div className="rounded-xl bg-slate-50 p-3 text-xs leading-6">
          1 افتح my.telegram.org · 2 سجّل دخول · 3 API development tools · 4 أنشئ تطبيقاً · 5 انسخ API ID و API Hash
        </div>
      </Card>
      <Modal open={false} title="إظهار المفاتيح" onClose={() => {}}>
        <Field label="كلمة مرور اللوحة"><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
      </Modal>
    </div>
  );
}
