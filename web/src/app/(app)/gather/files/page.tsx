"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Empty, Modal } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
import { formatNumber, formatDateTime } from "@/lib/utils";

export default function Page() {
  const { data, loading, reload } = useApi<{ files: any[] }>("/api/files");
  const [sel, setSel] = useState<string[]>([]);
  const [del, setDel] = useState(false);
  if (loading) return <LoadingGrid />;
  const files = data?.files || [];
  return (
    <div>
      <PageHeader title="الملفات المُصدَّرة" back="/gather" />
      <div className="space-y-2">
        {files.map((f) => (
          <Card key={f.id}>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={sel.includes(f.id)} onChange={() => setSel((s) => s.includes(f.id) ? s.filter((x) => x !== f.id) : [...s, f.id])} />
              <span>
                <span className="block font-bold text-navy">{f.name}</span>
                <span className="block text-sm text-ink-muted">{formatNumber(f.membersCount)} عضو · {f.source} · {f.status} · {formatDateTime(f.createdAt)}</span>
              </span>
            </label>
          </Card>
        ))}
        {files.length === 0 && <Empty icon="📁" title="لا ملفات بعد" hint="شغّل تجميعاً لإنشاء أول ملف" />}
      </div>
      {sel.length > 0 && <Button variant="danger" className="mt-4 w-full" onClick={() => setDel(true)}>حذف المحدد ({sel.length})</Button>}
      <Modal open={del} danger title="حذف الملفات؟" onClose={() => setDel(false)} footer={
        <><Button variant="ghost" onClick={() => setDel(false)}>إلغاء</Button>
        <Button variant="danger" onClick={async () => { await api("/api/files", { method: "DELETE", body: JSON.stringify({ ids: sel }) }); setSel([]); setDel(false); reload(); }}>حذف</Button></>
      }>سيُحذف الملف من الأداة فقط.</Modal>
    </div>
  );
}
