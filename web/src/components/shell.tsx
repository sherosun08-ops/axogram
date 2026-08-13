"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { bottomNav, navItems } from "@/lib/labels";
import { Icon } from "./icons";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { ToastHost, useToasts } from "./ui";

type Me = { id: string; name: string; email: string };
type Note = { id: string; title: string; body: string; type: string; read: boolean; href?: string; createdAt: string };

export function AppShell({
  children,
  title,
  user,
  settings,
}: {
  children: ReactNode;
  title?: string;
  user: Me;
  settings: Record<string, string>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const toasts = useToasts();

  useEffect(() => {
    api<{ notifications: Note[] }>("/api/notifications")
      .then((d) => setNotes(d.notifications))
      .catch(() => {});
  }, [pathname]);

  const unread = notes.filter((n) => !n.read).length;
  const apiOk = Boolean(settings.api_id && settings.api_hash);
  const locked = settings.emergency_lock === "1";

  const sectionTitle = useMemo(() => {
    if (title) return title;
    const hit = navItems.find((n) => n.href !== "/" && pathname.startsWith(n.href));
    return hit?.label || "TeleCore";
  }, [pathname, title]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  async function markAll() {
    await api("/api/notifications", { method: "PATCH", body: JSON.stringify({ all: true }) });
    setNotes((n) => n.map((x) => ({ ...x, read: true })));
  }

  return (
    <div className="min-h-screen bg-canvas">
      <ToastHost toasts={toasts.toasts} onClose={toasts.close} />

      <aside className="fixed bottom-0 top-0 z-30 hidden w-72 flex-col border-l border-slate-200 bg-navy text-white lg:flex">
        <div className="px-5 pb-4 pt-6">
          <div className="text-lg font-extrabold tracking-wide">TeleCore</div>
          <div className="mt-1 text-xs text-white/60">نظام إدارة القروبات</div>
        </div>
        <div className="mx-4 mb-4 rounded-2xl bg-white/10 p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", locked ? "bg-red-400" : "bg-emerald-400")} />
            {locked ? "النظام مقفل طوارئياً" : "النظام يعمل"}
          </div>
          <div className="mt-1 text-white/70">{apiOk ? "API متصل ✅" : "API غير مضبوط"}</div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-6">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                  active ? "bg-white text-navy font-semibold" : "text-white/80 hover:bg-white/10"
                )}
              >
                <Icon name={item.icon} className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="m-4 rounded-xl bg-white/10 px-3 py-2.5 text-sm text-white/80 hover:bg-white/15">
          🚪 تسجيل الخروج
        </button>
      </aside>

      <div className="lg:pr-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setDrawer(true)}>
                <Icon name="menu" />
              </button>
              <div className="font-bold text-navy">{sectionTitle}</div>
            </div>
            <div className="flex items-center gap-1">
              <button className="relative rounded-lg p-2 hover:bg-slate-100" onClick={() => setNotesOpen((v) => !v)}>
                <Icon name="bell" />
                {unread > 0 && (
                  <span className="absolute left-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] text-white">
                    {unread}
                  </span>
                )}
              </button>
              <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100" onClick={() => setUserMenu((v) => !v)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                  {user.name.slice(0, 1)}
                </span>
              </button>
            </div>
          </div>
          {locked && (
            <div className="flex items-center justify-between bg-danger px-4 py-2 text-sm text-white">
              <span>🔴 النظام مقفل طوارئياً</span>
              <Link href="/security/emergency" className="underline">فك القفل</Link>
            </div>
          )}
          {!apiOk && !locked && (
            <div className="flex items-center justify-between bg-accent px-4 py-2 text-sm text-white">
              <span>🔵 API غير مضبوط</span>
              <Link href="/settings/api" className="underline">اضبطه الآن</Link>
            </div>
          )}
        </header>

        {notesOpen && (
          <div className="absolute left-4 top-16 z-40 w-[min(92vw,380px)] rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-bold text-navy">التنبيهات</div>
              <button className="text-xs text-accent" onClick={markAll}>تعليم الكل كمقروء</button>
            </div>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {notes.length === 0 && <div className="p-6 text-center text-sm text-ink-muted">لا تنبيهات</div>}
              {notes.map((n) => (
                <Link
                  key={n.id}
                  href={n.href || "#"}
                  onClick={() => setNotesOpen(false)}
                  className={cn("block rounded-xl p-3 text-sm", n.read ? "bg-slate-50" : "bg-accent-soft")}
                >
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-xs text-ink-muted">{n.body}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {userMenu && (
          <div className="absolute left-4 top-16 z-40 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
            <div className="px-3 py-2 text-sm">
              <div className="font-bold">{user.name}</div>
              <div className="text-xs text-ink-muted">{user.email}</div>
            </div>
            <Link href="/settings/access" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50" onClick={() => setUserMenu(false)}>
              أمان الوصول
            </Link>
            <Link href="/settings" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50" onClick={() => setUserMenu(false)}>
              الإعدادات
            </Link>
            <button onClick={logout} className="block w-full rounded-xl px-3 py-2 text-right text-sm text-danger hover:bg-danger-soft">
              تسجيل الخروج
            </button>
          </div>
        )}

        <main className="mx-auto max-w-6xl px-4 pb-24 pt-5 lg:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5">
          {bottomNav.map((item) => {
            const active = item.href !== "#more" && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
            return (
              <button
                key={item.label}
                onClick={() => (item.href === "#more" ? setDrawer(true) : router.push(item.href))}
                className={cn("flex flex-col items-center gap-0.5 py-1 text-[10px]", active ? "text-accent" : "text-ink-muted")}
              >
                <Icon name={item.icon} className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {drawer && (
        <div className="fixed inset-0 z-50 bg-navy/40 lg:hidden" onClick={() => setDrawer(false)}>
          <div className="absolute inset-y-0 right-0 w-[84%] max-w-sm bg-navy p-5 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-lg font-extrabold">TeleCore</div>
                <div className="text-xs text-white/60">{apiOk ? "API متصل ✅" : "API غير مضبوط"}</div>
              </div>
              <button onClick={() => setDrawer(false)}>✕</button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawer(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/10"
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
            <button onClick={logout} className="mt-8 w-full rounded-xl bg-white/10 px-3 py-2.5 text-sm">
              🚪 تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
