"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";
import { Button, Field, Input } from "@/components/ui";

export default function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [email, setEmail] = useState("admin@telecore.app");
  const [password, setPassword] = useState("TeleCore@2026");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) return;
    setLoading(true);
    try {
      await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>
      <form onSubmit={submit} className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-card">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-lg font-black text-white">T</div>
          <h1 className="text-2xl font-extrabold text-navy">TeleCore</h1>
          <p className="mt-1 text-sm text-ink-muted">نظام إدارة القروبات</p>
        </div>
        <div className="space-y-3">
          <Field label="البريد الإلكتروني">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
          </Field>
          <Field label="كلمة المرور" error={error || undefined}>
            <div className="relative">
              <Input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="absolute left-3 top-2.5 text-xs text-ink-muted" onClick={() => setShow((s) => !s)}>
                {show ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </Field>
        </div>
        <Button className="mt-5 w-full" disabled={loading || !email || !password}>
          {loading ? "جاري التحقق..." : "تسجيل الدخول"}
        </Button>
        <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-ink-muted">
          حساب التجربة: <b>admin@telecore.app</b> / <b>TeleCore@2026</b>
        </div>
        <div className="mt-4 text-center text-xs text-ink-muted">v 1.0.0</div>
      </form>
    </div>
  );
}
