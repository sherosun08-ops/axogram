"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, Segment, Input, Button, Empty, Modal } from "@/components/ui";
import { LoadingGrid, useApi } from "@/components/data";
import { accountStatus, classification } from "@/lib/labels";
import { api } from "@/lib/api-client";
import { timeAgo } from "@/lib/utils";

type Acc = {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  status: keyof typeof accountStatus;
  classification: keyof typeof classification;
  healthScore: number;
  lastUsedAt?: string;
  restrictedUntil?: string;
  group?: { name: string } | null;
};

export default function AccountsList() {
  const { data, loading, reload } = useApi<{ accounts: Acc[] }>("/api/accounts");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [word, setWord] = useState("");

  const list = data?.accounts || [];
  const filtered = useMemo(() => {
    return list.filter((a) => {
      const name = `${a.firstName} ${a.lastName || ""} ${a.username || ""}`.toLowerCase();
      if (q && !name.includes(q.toLowerCase())) return false;
      if (tab === "active") return a.status === "active" || a.status === "premium";
      if (tab === "restricted") return a.status.startsWith("restricted");
      if (tab === "banned") return a.status === "banned";
      if (tab === "dead") return a.status === "dead_session";
      if (tab === "frozen") return a.status === "frozen";
      return true;
    });
  }, [list, q, tab]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function remove() {
    await api("/api/accounts", { method: "DELETE", body: JSON.stringify({ ids: selected }) });
    setConfirm(false);
    setSelected([]);
    setWord("");
    reload();
  }

  if (loading) return <LoadingGrid />;

  return (
    <div>
      <PageHeader title="الحسابات" back="/accounts" actions={<Link href="/accounts/add" className="btn-primary">إضافة</Link>} />
      <Input placeholder="بحث سريع..." value={q} onChange={(e) => setQ(e.target.value)} className="mb-3" />
      <Segment
        value={tab}
        onChange={setTab}
        options={[
          { id: "all", label: `الكل (${list.length})` },
          { id: "active", label: "🟢 نشط" },
          { id: "restricted", label: "⚠️ مقيد" },
          { id: "banned", label: "⛔ محظور" },
          { id: "dead", label: "🔑 ميت" },
          { id: "frozen", label: "❄️ مجمّد" },
        ]}
      />
      <div className="mt-4 space-y-2">
        {filtered.map((a) => {
          const st = accountStatus[a.status] || accountStatus.active;
          const cl = classification[a.classification] || classification.multi;
          return (
            <div key={a.id} className="card flex items-center gap-3 p-3">
              <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} />
              <Link href={`/accounts/${a.id}`} className="min-w-0 flex-1">
                <div className="flex items-center gap-2 font-semibold text-navy">
                  <span>{st.icon}</span>
                  {a.firstName} {a.lastName}
                </div>
                <div className="text-xs text-ink-muted">
                  {a.username ? `@${a.username}` : "بدون username"} · صحة {a.healthScore}% · {cl.icon} {cl.label}
                  {a.group ? ` · ${a.group.name}` : ""} · آخر استخدام {timeAgo(a.lastUsedAt)}
                </div>
                {a.status === "dead_session" && <div className="mt-1 text-xs text-slate-500">انتهت الجلسة — يحتاج إعادة دخول</div>}
                {a.restrictedUntil && <div className="mt-1 text-xs text-amber-600">مقيد حتى تاريخ محدد</div>}
              </Link>
              <Link href={`/accounts/${a.id}`} className="text-ink-muted">‹</Link>
            </div>
          );
        })}
        {filtered.length === 0 && <Empty icon="🔍" title="لا نتائج تطابق الفلاتر" hint="امسح البحث أو غيّر التبويب" />}
      </div>

      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-20 mx-auto flex max-w-lg items-center justify-between rounded-2xl bg-navy px-4 py-3 text-white shadow-card lg:bottom-6">
          <span>{selected.length} محدد</span>
          <div className="flex gap-2">
            <Link href="/accounts/warmup" className="rounded-lg bg-white/10 px-3 py-1 text-sm">تسخين</Link>
            <Link href="/accounts/health" className="rounded-lg bg-white/10 px-3 py-1 text-sm">فحص</Link>
            <button onClick={() => setConfirm(true)} className="rounded-lg bg-danger px-3 py-1 text-sm">حذف</button>
          </div>
        </div>
      )}

      <Modal
        open={confirm}
        danger
        title="حذف الحسابات"
        onClose={() => setConfirm(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>إلغاء</Button>
            <Button variant="danger" disabled={word !== "حذف"} onClick={remove}>تأكيد الحذف</Button>
          </>
        }
      >
        سيُحذف المحدد من الأداة فقط — لن يُحذف من تيليجرام.
        <input className="field mt-3" placeholder='اكتب «حذف» للتأكيد' value={word} onChange={(e) => setWord(e.target.value)} />
      </Modal>
    </div>
  );
}
