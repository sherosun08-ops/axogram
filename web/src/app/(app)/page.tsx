"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { Card } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

type Dash = {
  fleetHealth: number;
  settings: Record<string, string>;
  counts: {
    accounts: number;
    active: number;
    proxiesAlive: number;
    proxies: number;
    runningJobs: number;
    dmActive: number;
    groupActive: number;
  };
};

const tiles = [
  { href: "/accounts", icon: "👤", title: "الحسابات", key: "accounts", hint: (d: Dash) => `${d.counts.accounts} حساب` },
  { href: "/gather", icon: "📥", title: "التجميع", key: "gather", hint: () => "آخر: اليوم" },
  { href: "/adder", icon: "📤", title: "الإضافة", key: "add", hint: () => "عملية جارية" },
  { href: "/rotation", icon: "🔄", title: "التدوير", key: "rot", hint: () => "ذكي 🧠" },
  { href: "/proxy", icon: "🌐", title: "البروكسي", key: "proxy", hint: (d: Dash) => `${d.counts.proxiesAlive} نشط` },
  { href: "/settings", icon: "⚙️", title: "الإعدادات", key: "set", hint: () => "" },
  { href: "/reports", icon: "📊", title: "التقارير", key: "rep", hint: () => "" },
  { href: "/security", icon: "🛡️", title: "الأمان", key: "sec", hint: () => "🟢 ممتاز" },
  { href: "/messages", icon: "💬", title: "رسائل DM", key: "dm", hint: (d: Dash) => `${d.counts.dmActive} نشطة` },
  { href: "/campaigns", icon: "📢", title: "القروبات", key: "grp", hint: (d: Dash) => `${d.counts.groupActive} نشطة` },
];

export default function HomePage() {
  const [data, setData] = useState<Dash | null>(null);

  useEffect(() => {
    api<Dash>("/api/dashboard").then(setData).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-32" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy">مرحباً 👋</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {data.settings.emergency_lock === "1" ? "النظام مقفل طوارئياً 🔴" : "النظام يعمل بشكل طبيعي 🟢"}
          {" · "}صحة الأسطول {data.fleetHealth}%
        </p>
      </div>

      {data.settings.onboarding_done !== "1" && (
        <Card className="mb-5 bg-navy text-white">
          <div className="text-lg font-bold">مرحباً بك في TeleCore 🎉</div>
          <p className="mt-1 text-sm text-white/70">أكمل الخطوات التالية للبدء:</p>
          <div className="mt-4 space-y-2">
            {[
              ["ضبط مفاتيح API", "/settings/api"],
              ["إضافة أول حساب", "/accounts/add"],
              ["إضافة بروكسي (اختياري)", "/proxy/add"],
            ].map(([t, h]) => (
              <Link key={t} href={h} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm">
                {t} <span>ابدأ ←</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="card group p-4 hover:border-accent/40">
            <div className="text-2xl">{t.icon}</div>
            <div className="mt-3 font-bold text-navy">{t.title}</div>
            <div className="mt-1 text-xs text-ink-muted">{t.hint(data)}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Card href="/reports/live">
          <div className="text-sm text-ink-muted">مركز العمليات</div>
          <div className="mt-1 text-2xl font-bold text-navy">{formatNumber(data.counts.runningJobs)}</div>
          <div className="text-xs text-ink-muted">عمليات جارية الآن</div>
        </Card>
        <Card href="/accounts/list">
          <div className="text-sm text-ink-muted">الحسابات النشطة</div>
          <div className="mt-1 text-2xl font-bold text-navy">{formatNumber(data.counts.active)}</div>
          <div className="text-xs text-ink-muted">من أصل {data.counts.accounts}</div>
        </Card>
        <Card href="/proxy/list">
          <div className="text-sm text-ink-muted">البروكسيات الحية</div>
          <div className="mt-1 text-2xl font-bold text-navy">{formatNumber(data.counts.proxiesAlive)}</div>
          <div className="text-xs text-ink-muted">من أصل {data.counts.proxies}</div>
        </Card>
      </div>
    </div>
  );
}
