"use client";

import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";
import Link from "next/link";

export function Card({
  children,
  className,
  onClick,
  href,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const cls = cn("card p-4", onClick || href ? "hover:border-accent/40 transition cursor-pointer" : "", className);
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <div className={cls} onClick={onClick}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  back,
  actions,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          {back && (
            <Link href={back} className="rounded-lg p-1.5 text-ink-muted hover:bg-slate-100">
              →
            </Link>
          )}
          <h1 className="text-xl font-bold text-navy md:text-2xl">{title}</h1>
        </div>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Stat({
  icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const tones = {
    default: "bg-white",
    success: "bg-success-soft",
    warning: "bg-warning-soft",
    danger: "bg-danger-soft",
    info: "bg-accent-soft",
  };
  return (
    <div className={cn("card p-4", tones[tone])}>
      <div className="flex items-start justify-between">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="mt-3 text-2xl font-bold text-navy">{value}</div>
      <div className="mt-0.5 text-sm text-ink-muted">{label}</div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </div>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "ghost" | "danger";
}) {
  const map = {
    primary: "btn-primary",
    accent: "btn-accent",
    ghost: "btn-ghost",
    danger: "btn-danger",
  };
  return <button className={cn(map[variant], className)} {...props} />;
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
      {hint && !error && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("field", props.className)} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("field min-h-24", props.className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("field", className)} {...props}>
      {children}
    </select>
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Empty({
  icon,
  title,
  hint,
  action,
}: {
  icon?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="text-4xl">{icon || "📭"}</div>
      <h3 className="mt-3 text-lg font-bold text-navy">{title}</h3>
      {hint && <p className="mt-1 max-w-sm text-sm text-ink-muted">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Banner({
  tone = "info",
  children,
  action,
}: {
  tone?: "info" | "warning" | "danger" | "success";
  children: ReactNode;
  action?: ReactNode;
}) {
  const tones = {
    info: "bg-accent-soft text-navy border-accent/20",
    warning: "bg-warning-soft text-warning border-orange-200",
    danger: "bg-danger-soft text-danger border-red-200",
    success: "bg-success-soft text-success border-emerald-200",
  };
  return (
    <div className={cn("mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-sm", tones[tone])}>
      <div>{children}</div>
      {action}
    </div>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  danger,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/40 p-3 sm:items-center" onClick={onClose}>
      <div className="card w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className={cn("text-lg font-bold", danger ? "text-danger" : "text-navy")}>{title}</h3>
          <button onClick={onClose} className="text-ink-muted">✕</button>
        </div>
        <div className="text-sm text-ink">{children}</div>
        {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm"
    >
      <span className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-accent" : "bg-slate-300")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", checked ? "right-0.5" : "right-[22px]")} />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}

export function Radio({
  name,
  value,
  checked,
  onChange,
  label,
  hint,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className={cn("flex cursor-pointer gap-3 rounded-xl border p-3", checked ? "border-accent bg-accent-soft" : "border-slate-200")}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="mt-1" />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block text-xs text-ink-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function ToastHost({
  toasts,
  onClose,
}: {
  toasts: { id: string; type: string; text: string }[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[90] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => onClose(t.id)}
          className={cn(
            "pointer-events-auto rounded-xl px-4 py-3 text-right text-sm font-medium shadow-card",
            t.type === "success" && "bg-success text-white",
            t.type === "error" && "bg-danger text-white",
            t.type === "warning" && "bg-warning text-white",
            t.type === "info" && "bg-navy text-white"
          )}
        >
          {t.text}
        </button>
      ))}
    </div>
  );
}

export function useToasts() {
  const [toasts, setToasts] = useState<{ id: string; type: string; text: string }[]>([]);
  function push(type: string, text: string) {
    const id = Math.random().toString(36).slice(2);
    setToasts((s) => [...s.slice(-2), { id, type, text }]);
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), type === "error" ? 6000 : 4000);
  }
  return {
    toasts,
    push,
    success: (t: string) => push("success", t),
    error: (t: string) => push("error", t),
    warning: (t: string) => push("warning", t),
    info: (t: string) => push("info", t),
    close: (id: string) => setToasts((s) => s.filter((t) => t.id !== id)),
  };
}

export function RowLink({ href, icon, title, hint, badge }: { href: string; icon: string; title: string; hint?: string; badge?: ReactNode }) {
  return (
    <Link href={href} className="card flex items-center gap-3 p-4 hover:border-accent/40">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-lg">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-navy">{title}</span>
        {hint && <span className="block truncate text-xs text-ink-muted">{hint}</span>}
      </span>
      {badge}
      <span className="text-ink-muted">‹</span>
    </Link>
  );
}

export function Segment({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold",
            value === o.id ? "bg-navy text-white" : "bg-white text-ink-muted border border-slate-200"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
