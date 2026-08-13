export const accountStatus = {
  active: { label: "نشط", icon: "🟢", color: "text-success", bg: "bg-success-soft", dot: "bg-success" },
  premium: { label: "نشط مميز", icon: "🟢✦", color: "text-success", bg: "bg-gold-soft", dot: "bg-gold" },
  warming: { label: "قيد التسخين", icon: "🔥", color: "text-warning", bg: "bg-warning-soft", dot: "bg-warning" },
  restricted_temp: { label: "مقيد مؤقت", icon: "⚠️", color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
  restricted_perm: { label: "مقيد دائم", icon: "⛔", color: "text-danger", bg: "bg-danger-soft", dot: "bg-danger" },
  frozen: { label: "مجمّد", icon: "❄️", color: "text-sky-600", bg: "bg-sky-50", dot: "bg-sky-400" },
  dead_session: { label: "جلسة ميتة", icon: "🔑", color: "text-slate-500", bg: "bg-slate-100", dot: "bg-slate-400" },
  banned: { label: "محظور نهائياً", icon: "⛔", color: "text-red-800", bg: "bg-red-100", dot: "bg-red-800" },
  deleted: { label: "محذوف", icon: "💀", color: "text-slate-600", bg: "bg-slate-200", dot: "bg-slate-600" },
  unmeasurable: { label: "غير قابل للقياس", icon: "🔌", color: "text-orange-600", bg: "bg-orange-50", dot: "bg-orange-400" },
  conflict: { label: "متعارض", icon: "🔁", color: "text-yellow-700", bg: "bg-yellow-50", dot: "bg-yellow-600" },
} as const;

export const classification = {
  primary: { label: "رئيسي", icon: "🔴" },
  backup: { label: "احتياطي", icon: "🟡" },
  gather: { label: "تجميع", icon: "🟢" },
  add: { label: "إضافة", icon: "🔵" },
  multi: { label: "متعدد", icon: "⚪" },
} as const;

export const proxyStatus = {
  alive: { label: "نشط", icon: "🟢", color: "text-success" },
  dead: { label: "ميت", icon: "⛔", color: "text-danger" },
  slow: { label: "بطيء", icon: "🐢", color: "text-warning" },
  unknown: { label: "غير مفحوص", icon: "❔", color: "text-slate-500" },
} as const;

export const jobStatus = {
  pending: { label: "بالانتظار", color: "text-slate-500", bg: "bg-slate-100" },
  running: { label: "جارٍ", color: "text-accent", bg: "bg-accent-soft" },
  paused: { label: "متوقف", color: "text-warning", bg: "bg-warning-soft" },
  completed: { label: "مكتمل", color: "text-success", bg: "bg-success-soft" },
  failed: { label: "فاشل", color: "text-danger", bg: "bg-danger-soft" },
  partial: { label: "جزئي", color: "text-amber-600", bg: "bg-amber-50" },
  cancelled: { label: "ملغى", color: "text-slate-500", bg: "bg-slate-100" },
} as const;

export const campaignStatus = {
  draft: { label: "مسودة", color: "text-slate-500", bg: "bg-slate-100" },
  running: { label: "نشطة", color: "text-accent", bg: "bg-accent-soft" },
  paused: { label: "متوقفة", color: "text-warning", bg: "bg-warning-soft" },
  completed: { label: "مكتملة", color: "text-success", bg: "bg-success-soft" },
  failed: { label: "فاشلة", color: "text-danger", bg: "bg-danger-soft" },
} as const;

export const rotationState = {
  ready: { label: "جاهز", icon: "🟢" },
  active: { label: "نشط الآن", icon: "⚡" },
  resting: { label: "راحة", icon: "🧊" },
  excluded: { label: "مستبعد", icon: "🚫" },
  exhausted: { label: "استنفد حده", icon: "📉" },
} as const;

export function healthTone(score: number) {
  if (score >= 90) return { label: "ممتاز", color: "text-success", bar: "bg-success" };
  if (score >= 70) return { label: "جيد", color: "text-emerald-600", bar: "bg-emerald-500" };
  if (score >= 50) return { label: "متوسط", color: "text-warning", bar: "bg-warning" };
  return { label: "ضعيف", color: "text-danger", bar: "bg-danger" };
}

export const navItems = [
  { href: "/", icon: "home", label: "الرئيسية" },
  { href: "/accounts", icon: "users", label: "مدير الحسابات" },
  { href: "/gather", icon: "download", label: "تجميع الأعضاء" },
  { href: "/adder", icon: "user-plus", label: "إضافة الأعضاء" },
  { href: "/rotation", icon: "refresh", label: "نظام التدوير" },
  { href: "/proxy", icon: "globe", label: "مدير البروكسي" },
  { href: "/settings", icon: "settings", label: "الإعدادات" },
  { href: "/reports", icon: "chart", label: "التقارير والسجلات" },
  { href: "/security", icon: "shield", label: "أدوات الأمان" },
  { href: "/messages", icon: "message", label: "الرسائل الجماعية" },
  { href: "/campaigns", icon: "megaphone", label: "حملات القروبات" },
] as const;

export const bottomNav = [
  { href: "/", icon: "home", label: "الرئيسية" },
  { href: "/accounts", icon: "users", label: "الحسابات" },
  { href: "/reports/live", icon: "zap", label: "العمليات" },
  { href: "/proxy", icon: "globe", label: "البروكسي" },
  { href: "#more", icon: "more", label: "المزيد" },
] as const;
