import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type ID = string;

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export type DB = {
  users: any[];
  sessions: any[];
  loginAttempts: any[];
  accountGroups: any[];
  accounts: any[];
  proxyGroups: any[];
  proxies: any[];
  memberFiles: any[];
  jobs: any[];
  blacklist: any[];
  activityLogs: any[];
  notifications: any[];
  templates: any[];
  campaigns: any[];
  rotationSettings: any[];
  rotationSlots: any[];
  systemSettings: Record<string, string>;
  groupDirectory: any[];
};

const FILE = path.join(process.cwd(), "data", "telecore.json");

function empty(): DB {
  return {
    users: [],
    sessions: [],
    loginAttempts: [],
    accountGroups: [],
    accounts: [],
    proxyGroups: [],
    proxies: [],
    memberFiles: [],
    jobs: [],
    blacklist: [],
    activityLogs: [],
    notifications: [],
    templates: [],
    campaigns: [],
    rotationSettings: [],
    rotationSlots: [],
    systemSettings: {},
    groupDirectory: [],
  };
}

function load(): DB {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    const seeded = seed();
    save(seeded);
    return seeded;
  }
}

function save(db: DB) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

let cache: DB | null = null;

export function db(): DB {
  if (!cache) cache = load();
  return cache;
}

export function persist() {
  if (cache) save(cache);
}

export function resetStore() {
  cache = seed();
  save(cache);
}

function seed(): DB {
  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync("TeleCore@2026", 10);
  const gGather = { id: uid(), name: "أسطول التجميع", purpose: "gather", description: "حسابات مخصصة لاستخراج الأعضاء", createdAt: now };
  const gAdd = { id: uid(), name: "أسطول الإضافة", purpose: "add", description: "حسابات إضافة الأعضاء", createdAt: now };
  const gMain = { id: uid(), name: "الحسابات الرئيسية", purpose: "primary", description: "لا تُستخدم في العمليات الخطرة", createdAt: now };
  const pgEu = { id: uid(), name: "أوروبا", description: "بروكسيات أوروبية", createdAt: now };
  const pgMe = { id: uid(), name: "الخليج", description: "بروكسيات الشرق الأوسط", createdAt: now };

  const proxies = [
    { id: uid(), host: "185.32.11.44", port: 1080, type: "socks5", country: "ألمانيا", city: "فرانكفورت", status: "alive", latencyMs: 42, failCount: 0, groupId: pgEu.id, createdAt: now, lastCheckedAt: now },
    { id: uid(), host: "91.200.12.8", port: 1080, type: "socks5", country: "هولندا", city: "أمستردام", status: "alive", latencyMs: 38, failCount: 0, groupId: pgEu.id, createdAt: now, lastCheckedAt: now },
    { id: uid(), host: "45.76.19.201", port: 443, type: "http", country: "فرنسا", city: "باريس", status: "slow", latencyMs: 310, failCount: 1, groupId: pgEu.id, createdAt: now, lastCheckedAt: now },
    { id: uid(), host: "102.44.18.9", port: 1080, type: "socks5", country: "السعودية", city: "الرياض", status: "alive", latencyMs: 21, failCount: 0, groupId: pgMe.id, createdAt: now, lastCheckedAt: now },
    { id: uid(), host: "37.211.55.14", port: 1080, type: "socks5", country: "قطر", city: "الدوحة", status: "alive", latencyMs: 29, failCount: 0, groupId: pgMe.id, createdAt: now, lastCheckedAt: now },
    { id: uid(), host: "5.160.88.22", port: 1080, type: "socks5", country: "الإمارات", city: "دبي", status: "dead", latencyMs: null, failCount: 6, groupId: pgMe.id, createdAt: now, lastCheckedAt: now },
    { id: uid(), host: "198.12.77.3", port: 443, type: "mtproto", country: "تركيا", city: "إسطنبول", status: "alive", latencyMs: 67, failCount: 0, secret: "dd0123456789abcdef0123456789abcdef", createdAt: now, lastCheckedAt: now },
    { id: uid(), host: "176.9.44.101", port: 1080, type: "socks5", country: "ألمانيا", city: "نورنبرغ", status: "unknown", latencyMs: null, failCount: 0, createdAt: now },
  ];

  const accountsData = [
    { firstName: "فهد", lastName: "العتيبي", username: "fahd_ops", phone: "+966501112233", status: "active", classification: "primary", healthScore: 96, isPremium: true, groupId: gMain.id, proxyId: proxies[3].id, usedAdd: 4, usedGather: 120, groupsJoined: 48, floodWaitsWeek: 0, twoFA: true, estimatedAge: "4 سنوات" },
    { firstName: "نورة", lastName: "القحطاني", username: "noura_hq", phone: "+966552223344", status: "premium", classification: "primary", healthScore: 94, isPremium: true, groupId: gMain.id, proxyId: proxies[4].id, usedAdd: 2, usedGather: 40, groupsJoined: 22, twoFA: true, estimatedAge: "3 سنوات" },
    { firstName: "خالد", lastName: "الشمري", username: "khaled_scrape", phone: "+966533334455", status: "active", classification: "gather", healthScore: 88, groupId: gGather.id, proxyId: proxies[0].id, usedGather: 340, groupsJoined: 91, estimatedAge: "18 شهر" },
    { firstName: "سارة", lastName: "الدوسري", username: "sara_collect", phone: "+966544445566", status: "active", classification: "gather", healthScore: 81, groupId: gGather.id, proxyId: proxies[1].id, usedGather: 210, groupsJoined: 64, estimatedAge: "11 شهر" },
    { firstName: "عبدالله", lastName: "الحربي", username: "abdullah_add", phone: "+966555556677", status: "active", classification: "add", healthScore: 79, groupId: gAdd.id, proxyId: proxies[0].id, usedAdd: 14, groupsJoined: 37, estimatedAge: "2 سنة" },
    { firstName: "ريم", lastName: "المطيري", username: "reem_join", phone: "+966566667788", status: "warming", classification: "add", healthScore: 62, groupId: gAdd.id, proxyId: proxies[1].id, usedAdd: 3, groupsJoined: 12, estimatedAge: "3 أسابيع" },
    { firstName: "ماجد", lastName: "الغامدي", username: "majed_rot", phone: "+966577778899", status: "restricted_temp", classification: "add", healthScore: 54, groupId: gAdd.id, proxyId: proxies[2].id, usedAdd: 20, restrictedUntil: new Date(Date.now() + 36 * 3600e3).toISOString(), estimatedAge: "7 أشهر" },
    { firstName: "هند", lastName: "الزهراني", username: null, phone: "+966588889900", status: "frozen", classification: "multi", healthScore: 41, proxyId: proxies[6].id, estimatedAge: "5 أشهر" },
    { firstName: "يوسف", lastName: "العنزي", username: "yousef_old", phone: "+966599990011", status: "dead_session", classification: "backup", healthScore: 30, estimatedAge: "2 سنة" },
    { firstName: "لينا", lastName: "السبيعي", username: "lina_msg", phone: "+966511223344", status: "active", classification: "multi", healthScore: 86, isPremium: true, proxyId: proxies[4].id, usedDm: 18, groupsJoined: 29, estimatedAge: "2 سنة" },
    { firstName: "تركي", lastName: "البقمي", username: "turki_fail", phone: "+966522334455", status: "banned", classification: "multi", healthScore: 8, estimatedAge: "4 أشهر" },
    { firstName: "أمل", lastName: "الشهري", username: "amal_dc", phone: "+966533445566", status: "unmeasurable", classification: "backup", healthScore: 50, proxyId: proxies[5].id, estimatedAge: "9 أشهر" },
  ];

  const accounts = accountsData.map((a, i) => ({
    id: uid(),
    telegramId: String(100000000 + i * 7919),
    dc: [1, 2, 4, 5][i % 4],
    device: "Telegram Desktop",
    os: "Linux",
    appVersion: "5.8.3",
    lastUsedAt: new Date(Date.now() - i * 3600e3).toISOString(),
    lastCheckedAt: now,
    bio: a.classification === "primary" ? "حساب تشغيلي" : "عضو نشط",
    dailyGatherLimit: 500,
    dailyAddLimit: 20,
    dailyDmLimit: 30,
    dailyCampaignLimit: 25,
    usedGather: 0,
    usedAdd: 0,
    usedDm: 0,
    usedCampaign: 0,
    rotationPriority: "medium",
    allowGather: true,
    allowAdd: true,
    allowDm: true,
    allowCampaign: true,
    inRotation: true,
    createdAt: now,
    addedAt: now,
    ...a,
  }));

  const slots = accounts
    .filter((a) => ["active", "premium", "warming"].includes(a.status))
    .map((a, i) => ({
      id: uid(),
      accountId: a.id,
      order: i + 1,
      state: a.status === "warming" ? "excluded" : i === 0 ? "active" : "ready",
      usedToday: (a.usedAdd || 0) + Math.floor((a.usedGather || 0) / 40),
    }));

  return {
    users: [{ id: uid(), email: "admin@telecore.app", passwordHash, name: "مدير النظام", role: "admin", createdAt: now }],
    sessions: [],
    loginAttempts: [
      { id: uid(), email: "admin@telecore.app", ip: "185.32.11.20", userAgent: "Chrome", success: true, reason: "ok", createdAt: now },
      { id: uid(), email: "admin@telecore.app", ip: "102.44.9.18", userAgent: "Firefox", success: false, reason: "كلمة مرور خاطئة", createdAt: now },
    ],
    accountGroups: [gGather, gAdd, gMain],
    accounts,
    proxyGroups: [pgEu, pgMe],
    proxies,
    memberFiles: [
      { id: uid(), name: "قروب التسويق_2026-08-10", source: "public_group", sourceRef: "t.me/market_ksa", membersCount: 18420, status: "ready", createdAt: now },
      { id: uid(), name: "دعوة خاصة — دورة البرمجة", source: "invite", sourceRef: "t.me/+Ab12Cd34", membersCount: 932, status: "ready", createdAt: now },
      { id: uid(), name: "تفاعلات إعلان رمضان", source: "reactions", sourceRef: "msg/8821", membersCount: 641, status: "ready", createdAt: now },
      { id: uid(), name: "سجل رسائل الدعم", source: "messages", sourceRef: "t.me/support_hub", membersCount: 2204, status: "processing", createdAt: now },
      { id: uid(), name: "دمج أغسطس", source: "merge", sourceRef: "3 ملفات", membersCount: 24110, status: "ready", createdAt: now },
    ],
    jobs: [
      { id: uid(), type: "gather", status: "completed", title: "تجميع من قروب التسويق", progress: 18420, total: 18420, successCount: 17902, failCount: 318, skipCount: 200, startedAt: now, finishedAt: now, config: "{}", liveLog: "[]", createdAt: now },
      { id: uid(), type: "add", status: "running", title: "إضافة دفعة أغسطس إلى قروب العملاء", progress: 146, total: 400, successCount: 128, failCount: 11, skipCount: 7, currentItem: "إضافة @user_392", startedAt: now, config: "{}", liveLog: JSON.stringify([{ t: now, level: "success", text: "أُضيف عضو بنجاح" }]), createdAt: now },
      { id: uid(), type: "warmup", status: "running", title: "تسخين حساب ريم المطيري", progress: 3, total: 7, successCount: 3, failCount: 0, skipCount: 0, startedAt: now, config: "{}", liveLog: "[]", createdAt: now },
      { id: uid(), type: "health", status: "completed", title: "فحص صحة الأسطول", progress: 12, total: 12, successCount: 8, failCount: 4, skipCount: 0, startedAt: now, finishedAt: now, config: "{}", liveLog: "[]", createdAt: now },
      { id: uid(), type: "add", status: "partial", title: "إضافة يدوية — قائمة VIP", progress: 40, total: 40, successCount: 27, failCount: 8, skipCount: 5, startedAt: now, finishedAt: now, config: "{}", liveLog: "[]", createdAt: now },
    ],
    blacklist: [
      { id: uid(), value: "@spammer_x", kind: "user", reason: "بلاغات متكررة", scope: "global", createdAt: now },
      { id: uid(), value: "+966500000001", kind: "user", reason: "خصوصية مغلقة", scope: "add", createdAt: now },
      { id: uid(), value: "t.me/scam_deals", kind: "group", reason: "محتوى مخالف", scope: "global", createdAt: now },
      { id: uid(), value: "قرض فوري", kind: "word", reason: "كلمة محظورة", scope: "dm", createdAt: now },
    ],
    activityLogs: [
      { id: uid(), type: "gather", level: "success", message: "جُمع 420 عضواً من قروب التسويق", accountId: accounts[2].id, createdAt: now },
      { id: uid(), type: "add", level: "warning", message: "FloodWait 32 ثانية أثناء الإضافة", accountId: accounts[4].id, createdAt: now },
      { id: uid(), type: "system", level: "info", message: "تم فحص صحة الأسطول — 8 نشط / 4 يحتاج مراجعة", createdAt: now },
      { id: uid(), type: "security", level: "error", message: "حساب تركي البقمي محظور نهائياً", accountId: accounts[10].id, createdAt: now },
      { id: uid(), type: "dm", level: "success", message: "أُرسلت 40 رسالة ترحيب", accountId: accounts[9].id, createdAt: now },
    ],
    notifications: [
      { id: uid(), title: "دخول جديد للوحة", body: "تم الدخول من 185.32.11.20 عبر Chrome", type: "info", read: false, href: "/settings/access", createdAt: now },
      { id: uid(), title: "تغيّرت حالة حسابين", body: "ماجد أصبح مقيداً — أمل غير قابلة للقياس", type: "warning", read: false, href: "/accounts/list", createdAt: now },
      { id: uid(), title: "بروكسي ميت ومعيَّن", body: "5.160.88.22 معيَّن لحساب أمل", type: "danger", read: false, href: "/proxy/replace", createdAt: now },
      { id: uid(), title: "اكتمل تجميع قروب التسويق", body: "17,902 عضو صالح", type: "success", read: false, href: "/gather/files", createdAt: now },
    ],
    templates: [
      { id: uid(), kind: "gather", name: "تجميع قروب عام سريع", content: "{}", createdAt: now },
      { id: uid(), kind: "message", name: "ترحيب رسمي", content: "أهلاً {{name}}، شكراً لتواصلك معنا.", createdAt: now },
      { id: uid(), kind: "campaign", name: "إعلان قروب قصير", content: "فرصة جديدة اليوم.", createdAt: now },
    ],
    campaigns: [
      { id: uid(), kind: "dm", name: "ترحيب العملاء الجدد", status: "running", message: "مرحباً {{name}}", targetsCount: 800, sentCount: 214, failCount: 19, createdAt: now },
      { id: uid(), kind: "dm", name: "عرض نهاية الأسبوع", status: "paused", message: "خصم 20٪", targetsCount: 1500, sentCount: 640, failCount: 41, createdAt: now },
      { id: uid(), kind: "dm", name: "تذكير السلة", status: "draft", message: "سلتك بانتظارك", targetsCount: 220, sentCount: 0, failCount: 0, createdAt: now },
      { id: uid(), kind: "groups", name: "إعلان الدورة الجديدة", status: "running", message: "فتحنا التسجيل", targetsCount: 48, sentCount: 12, failCount: 1, createdAt: now },
      { id: uid(), kind: "groups", name: "تهنئة العيد", status: "completed", message: "كل عام وأنتم بخير", targetsCount: 30, sentCount: 30, failCount: 0, createdAt: now },
    ],
    rotationSettings: [{ id: "default", mode: "smart", enabled: true, switchAfter: 10, restAfter: 20, restMinutes: 20, dailyResetTime: "00:00", excludeRestricted: true, excludeDead: true, excludeWarming: true, workFrom: "09:00", workTo: "23:00" }],
    rotationSlots: slots,
    systemSettings: {
      api_id: "20485731",
      api_hash: "a1b2c3d4e5f6789012345678901234ab",
      api_tested: "1",
      daily_add_limit: "20",
      daily_gather_limit: "500",
      daily_dm_limit: "30",
      daily_campaign_limit: "25",
      delay_min: "60",
      delay_max: "120",
      security_level: "balanced",
      language: "ar",
      timezone: "Asia/Riyadh",
      onboarding_done: "1",
      emergency_lock: "0",
      version: "1.0.0",
      notify_enabled: "1",
      notify_target: "@telecore_alerts",
      session_timeout: "8h",
    },
    groupDirectory: [
      { id: uid(), title: "عملاء VIP", username: "clients_vip", members: 8420, type: "public", createdAt: now },
      { id: uid(), title: "دورة البرمجة", inviteLink: "t.me/+Ab12Cd34", members: 932, type: "private", createdAt: now },
      { id: uid(), title: "قناة العروض", username: "offers_daily", members: 22100, type: "channel", createdAt: now },
      { id: uid(), title: "مجتمع المسوقين", username: "market_ksa", members: 54000, type: "public", createdAt: now },
    ],
  };
}

export function createId() {
  return uid();
}

export function withAccount(a: any, data = db()) {
  return {
    ...a,
    group: data.accountGroups.find((g) => g.id === a.groupId) || null,
    proxy: data.proxies.find((p) => p.id === a.proxyId) || null,
    activities: data.activityLogs.filter((l) => l.accountId === a.id),
  };
}

export function withProxy(p: any, data = db()) {
  return {
    ...p,
    group: data.proxyGroups.find((g) => g.id === p.groupId) || null,
    accounts: data.accounts.filter((a) => a.proxyId === p.id),
  };
}
