"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { Banner, Button, Card, Field, Input, Modal, Progress, Select, Stat, Textarea, Toggle } from "./ui";
import { useApi } from "./data";
import { formatDateTime } from "@/lib/utils";

export function useOp() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  async function run<T = any>(action: string, payload: any = {}) {
    setBusy(true);
    setErr("");
    try {
      const r = await api<T>("/api/ops", { method: "POST", body: JSON.stringify({ action, payload }) });
      return r;
    } catch (e) {
      setErr((e as Error).message);
      throw e;
    } finally {
      setBusy(false);
    }
  }
  return { busy, msg, err, setMsg, setErr, run };
}

export function Feedback({ err, msg }: { err?: string; msg?: string }) {
  return (
    <>
      {err && <Banner tone="danger">{err}</Banner>}
      {msg && <Banner tone="success">{msg}</Banner>}
    </>
  );
}

export function LaunchJob({
  action,
  payload,
  label,
  disabled,
}: {
  action: string;
  payload: any;
  label: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const op = useOp();
  return (
    <div>
      <Feedback err={op.err} />
      <Button
        className="w-full"
        disabled={disabled || op.busy}
        onClick={async () => {
          const r: any = await op.run(action, payload);
          if (r.job?.id) router.push(`/reports/live/${r.job.id}`);
          else op.setMsg("تم");
        }}
      >
        {op.busy ? "جاري..." : label}
      </Button>
    </div>
  );
}

export function SettingsForm({
  keys,
  title,
  back,
  success = "تم حفظ الإعدادات",
}: {
  keys: { key: string; label: string; type?: "text" | "number" | "toggle" | "select"; options?: string[]; hint?: string }[];
  title: string;
  back: string;
  success?: string;
}) {
  const { data, reload } = useApi<any>("/api/settings");
  const [form, setForm] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const op = useOp();
  useEffect(() => {
    if (data?.settings) {
      const next: Record<string, string> = {};
      keys.forEach((k) => (next[k.key] = data.settings[k.key] ?? ""));
      setForm(next);
    }
  }, [data]);
  return (
    <Card className="space-y-3">
      <Feedback err={op.err} msg={op.msg} />
      {keys.map((k) => (
        <div key={k.key}>
          {k.type === "toggle" ? (
            <Toggle
              checked={form[k.key] === "1" || form[k.key] === "true"}
              onChange={(v) => {
                setForm({ ...form, [k.key]: v ? "1" : "0" });
                setDirty(true);
              }}
              label={k.label}
            />
          ) : k.type === "select" ? (
            <Field label={k.label} hint={k.hint}>
              <Select
                value={form[k.key] || ""}
                onChange={(e) => {
                  setForm({ ...form, [k.key]: e.target.value });
                  setDirty(true);
                }}
              >
                {(k.options || []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            </Field>
          ) : (
            <Field label={k.label} hint={k.hint}>
              <Input
                type={k.type === "number" ? "number" : "text"}
                value={form[k.key] || ""}
                onChange={(e) => {
                  setForm({ ...form, [k.key]: e.target.value });
                  setDirty(true);
                }}
              />
            </Field>
          )}
        </div>
      ))}
      <Button
        className="w-full"
        disabled={!dirty || op.busy}
        onClick={async () => {
          await api("/api/settings", { method: "PATCH", body: JSON.stringify(form) });
          setDirty(false);
          op.setMsg(success);
          reload();
        }}
      >
        {op.busy ? "جاري الحفظ..." : dirty ? "حفظ التغييرات" : "لا تغييرات"}
      </Button>
    </Card>
  );
}

export function AccountSelect({
  value,
  onChange,
  filter,
  label = "الحساب",
}: {
  value: string;
  onChange: (v: string) => void;
  filter?: (a: any) => boolean;
  label?: string;
}) {
  const { data } = useApi<{ accounts: any[] }>("/api/accounts");
  const list = (data?.accounts || []).filter(filter || (() => true));
  return (
    <Field label={label}>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">اختيار تلقائي من التدوير</option>
        {list.map((a) => (
          <option key={a.id} value={a.id}>
            {a.firstName} {a.lastName || ""} — {a.status} — صحة {a.healthScore}%
          </option>
        ))}
      </Select>
    </Field>
  );
}

export function FileSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data } = useApi<{ files: any[] }>("/api/files");
  return (
    <Field label="ملف الأعضاء">
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">اختر ملفاً...</option>
        {(data?.files || []).map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} ({f.membersCount})
          </option>
        ))}
      </Select>
    </Field>
  );
}

export function Steps({ items, step }: { items: string[]; step: number }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex flex-wrap gap-2 text-xs">
        {items.map((s, i) => (
          <span key={s} className={i <= step ? "font-bold text-accent" : "text-ink-muted"}>
            {i + 1}. {s}
          </span>
        ))}
      </div>
      <Progress value={((step + 1) / items.length) * 100} />
    </div>
  );
}

export function DangerConfirm({
  open,
  title,
  word,
  onClose,
  onOk,
  children,
}: {
  open: boolean;
  title: string;
  word: string;
  onClose: () => void;
  onOk: () => void;
  children: ReactNode;
}) {
  const [v, setV] = useState("");
  useEffect(() => {
    if (open) setV("");
  }, [open]);
  return (
    <Modal
      open={open}
      danger
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button variant="danger" disabled={v !== word} onClick={onOk}>
            تأكيد
          </Button>
        </>
      }
    >
      {children}
      <Input className="mt-3" value={v} onChange={(e) => setV(e.target.value)} placeholder={`اكتب «${word}»`} />
    </Modal>
  );
}

export function LogList({ type }: { type?: string }) {
  const { data } = useApi<{ logs: any[] }>(type ? `/api/logs?type=${type}` : "/api/logs");
  const logs = data?.logs || [];
  return (
    <div className="space-y-2">
      {logs.map((l: any) => (
        <Card key={l.id}>
          <div className="text-sm font-semibold">
            {l.level === "error" ? "❌" : l.level === "warning" ? "⚠️" : "✅"} {l.message}
          </div>
          <div className="text-xs text-ink-muted">
            {l.account ? `${l.account.firstName} · ` : ""}
            {formatDateTime(l.createdAt)}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function PeriodStats({ jobs, kind }: { jobs: any[]; kind?: string }) {
  const list = useMemo(() => (kind ? jobs.filter((j) => j.type === kind) : jobs), [jobs, kind]);
  const success = list.reduce((s, j) => s + (j.successCount || 0), 0);
  const fail = list.reduce((s, j) => s + (j.failCount || 0), 0);
  const running = list.filter((j) => j.status === "running").length;
  return (
    <div className="mb-4 grid grid-cols-3 gap-2">
      <Stat label="عمليات" value={list.length} />
      <Stat label="نجاح" value={success} tone="success" />
      <Stat label="فشل / جارية" value={`${fail} / ${running}`} tone={fail ? "danger" : "info"} />
    </div>
  );
}
