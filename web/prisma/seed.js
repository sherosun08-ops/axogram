const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.rotationSlot.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.template.deleteMany();
  await prisma.blacklist.deleteMany();
  await prisma.job.deleteMany();
  await prisma.memberFile.deleteMany();
  await prisma.groupDirectory.deleteMany();
  await prisma.account.deleteMany();
  await prisma.accountGroup.deleteMany();
  await prisma.proxy.deleteMany();
  await prisma.proxyGroup.deleteMany();
  await prisma.loginAttempt.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rotationSettings.deleteMany();
  await prisma.systemSetting.deleteMany();

  const passwordHash = await bcrypt.hash("TeleCore@2026", 10);
  await prisma.user.create({
    data: {
      email: "admin@telecore.app",
      passwordHash,
      name: "مدير النظام",
      role: "admin",
    },
  });

  const settings = {
    api_id: "20485731",
    api_hash: "a1b2c3d4e5f6789012345678901234ab",
    api_tested: "1",
    daily_add_limit: "20",
    daily_gather_limit: "500",
    daily_dm_limit: "30",
    daily_campaign_limit: "25",
    delay_min: "60",
    delay_max: "120",
    switch_after: "10",
    rest_after: "20",
    rest_minutes: "20",
    smart_limits: "1",
    path_sessions: "./sessions",
    path_exports: "./exports",
    path_logs: "./logs",
    path_backups: "./backups",
    path_templates: "./templates",
    notify_enabled: "1",
    notify_target: "@telecore_alerts",
    security_level: "balanced",
    language: "ar",
    timezone: "Asia/Riyadh",
    time_format: "24",
    date_format: "YYYY/MM/DD",
    log_level: "info",
    concurrency: "3",
    cache_mb: "256",
    request_timeout: "30",
    retries: "3",
    session_timeout: "8h",
    onboarding_done: "1",
    emergency_lock: "0",
    encrypt_sessions: "0",
    version: "1.0.0",
  };
  await prisma.systemSetting.createMany({
    data: Object.entries(settings).map(([key, value]) => ({ key, value })),
  });

  const gGather = await prisma.accountGroup.create({
    data: { name: "أسطول التجميع", purpose: "gather", description: "حسابات مخصصة لاستخراج الأعضاء" },
  });
  const gAdd = await prisma.accountGroup.create({
    data: { name: "أسطول الإضافة", purpose: "add", description: "حسابات إضافة الأعضاء للقروبات" },
  });
  const gMain = await prisma.accountGroup.create({
    data: { name: "الحسابات الرئيسية", purpose: "primary", description: "لا تُستخدم في العمليات الخطرة" },
  });

  const pgEu = await prisma.proxyGroup.create({
    data: { name: "أوروبا", description: "بروكسيات أوروبية منخفضة الكمون" },
  });
  const pgMe = await prisma.proxyGroup.create({
    data: { name: "الخليج", description: "بروكسيات الشرق الأوسط" },
  });

  const proxies = await Promise.all(
    [
      { host: "185.32.11.44", port: 1080, type: "socks5", country: "ألمانيا", city: "فرانكفورت", status: "alive", latencyMs: 42, groupId: pgEu.id },
      { host: "91.200.12.8", port: 1080, type: "socks5", country: "هولندا", city: "أمستردام", status: "alive", latencyMs: 38, groupId: pgEu.id },
      { host: "45.76.19.201", port: 443, type: "http", country: "فرنسا", city: "باريس", status: "slow", latencyMs: 310, groupId: pgEu.id },
      { host: "102.44.18.9", port: 1080, type: "socks5", country: "السعودية", city: "الرياض", status: "alive", latencyMs: 21, groupId: pgMe.id },
      { host: "37.211.55.14", port: 1080, type: "socks5", country: "قطر", city: "الدوحة", status: "alive", latencyMs: 29, groupId: pgMe.id },
      { host: "5.160.88.22", port: 1080, type: "socks5", country: "الإمارات", city: "دبي", status: "dead", latencyMs: null, failCount: 6, groupId: pgMe.id },
      { host: "198.12.77.3", port: 443, type: "mtproto", country: "تركيا", city: "إسطنبول", status: "alive", latencyMs: 67, secret: "dd0123456789abcdef0123456789abcdef" },
      { host: "176.9.44.101", port: 1080, type: "socks5", country: "ألمانيا", city: "نورنبرغ", status: "unknown" },
    ].map((p) => prisma.proxy.create({ data: { ...p, lastCheckedAt: new Date(Date.now() - 1000 * 60 * 18) } }))
  );

  const now = Date.now();
  const accountsData = [
    { firstName: "فهد", lastName: "العتيبي", username: "fahd_ops", phone: "+966501112233", status: "active", classification: "primary", healthScore: 96, isPremium: true, groupId: gMain.id, proxyId: proxies[3].id, usedAdd: 4, usedGather: 120, groupsJoined: 48, floodWaitsWeek: 0, twoFA: true, estimatedAge: "4 سنوات", avatarColor: "#0B1F3A" },
    { firstName: "نورة", lastName: "القحطاني", username: "noura_hq", phone: "+966552223344", status: "premium", classification: "primary", healthScore: 94, isPremium: true, groupId: gMain.id, proxyId: proxies[4].id, usedAdd: 2, usedGather: 40, groupsJoined: 22, twoFA: true, estimatedAge: "3 سنوات", avatarColor: "#7C3AED" },
    { firstName: "خالد", lastName: "الشمري", username: "khaled_scrape", phone: "+966533334455", status: "active", classification: "gather", healthScore: 88, groupId: gGather.id, proxyId: proxies[0].id, usedGather: 340, groupsJoined: 91, estimatedAge: "18 شهر", avatarColor: "#229ED9" },
    { firstName: "سارة", lastName: "الدوسري", username: "sara_collect", phone: "+966544445566", status: "active", classification: "gather", healthScore: 81, groupId: gGather.id, proxyId: proxies[1].id, usedGather: 210, groupsJoined: 64, estimatedAge: "11 شهر", avatarColor: "#EC4899" },
    { firstName: "عبدالله", lastName: "الحربي", username: "abdullah_add", phone: "+966555556677", status: "active", classification: "add", healthScore: 79, groupId: gAdd.id, proxyId: proxies[0].id, usedAdd: 14, groupsJoined: 37, estimatedAge: "2 سنة", avatarColor: "#0EA5E9" },
    { firstName: "ريم", lastName: "المطيري", username: "reem_join", phone: "+966566667788", status: "warming", classification: "add", healthScore: 62, groupId: gAdd.id, proxyId: proxies[1].id, usedAdd: 3, groupsJoined: 12, estimatedAge: "3 أسابيع", avatarColor: "#F59E0B" },
    { firstName: "ماجد", lastName: "الغامدي", username: "majed_rot", phone: "+966577778899", status: "restricted_temp", classification: "add", healthScore: 54, groupId: gAdd.id, proxyId: proxies[2].id, usedAdd: 20, restrictedUntil: new Date(now + 1000 * 60 * 60 * 36), estimatedAge: "7 أشهر", avatarColor: "#F97316" },
    { firstName: "هند", lastName: "الزهراني", username: null, phone: "+966588889900", status: "frozen", classification: "multi", healthScore: 41, proxyId: proxies[6].id, estimatedAge: "5 أشهر", avatarColor: "#38BDF8" },
    { firstName: "يوسف", lastName: "العنزي", username: "yousef_old", phone: "+966599990011", status: "dead_session", classification: "backup", healthScore: 30, estimatedAge: "2 سنة", avatarColor: "#64748B" },
    { firstName: "لينا", lastName: "السبيعي", username: "lina_msg", phone: "+966511223344", status: "active", classification: "multi", healthScore: 86, isPremium: true, proxyId: proxies[4].id, usedDm: 18, groupsJoined: 29, estimatedAge: "2 سنة", avatarColor: "#A855F7" },
    { firstName: "تركي", lastName: "البقمي", username: "turki_fail", phone: "+966522334455", status: "banned", classification: "multi", healthScore: 8, estimatedAge: "4 أشهر", avatarColor: "#B91C1C" },
    { firstName: "أمل", lastName: "الشهري", username: "amal_dc", phone: "+966533445566", status: "unmeasurable", classification: "backup", healthScore: 50, proxyId: proxies[5].id, estimatedAge: "9 أشهر", avatarColor: "#FB923C" },
  ];

  const accounts = [];
  for (const a of accountsData) {
    const acc = await prisma.account.create({
      data: {
        ...a,
        telegramId: String(100000000 + Math.floor(Math.random() * 800000000)),
        dc: [1, 2, 4, 5][Math.floor(Math.random() * 4)],
        device: "Telegram Desktop",
        os: "Linux",
        appVersion: "5.8.3",
        lastUsedAt: new Date(now - Math.floor(Math.random() * 1000 * 60 * 60 * 20)),
        lastCheckedAt: new Date(now - 1000 * 60 * 12),
        bio: a.classification === "primary" ? "حساب تشغيلي — لا تراسل" : "عضو نشط",
      },
    });
    accounts.push(acc);
  }

  await prisma.rotationSettings.create({
    data: { id: "default", mode: "smart", enabled: true },
  });

  let order = 1;
  for (const acc of accounts.filter((a) => ["active", "premium", "warming"].includes(a.status))) {
    await prisma.rotationSlot.create({
      data: {
        accountId: acc.id,
        order: order++,
        state: acc.status === "warming" ? "excluded" : order === 2 ? "active" : "ready",
        usedToday: acc.usedAdd + Math.floor(acc.usedGather / 40),
      },
    });
  }

  await prisma.memberFile.createMany({
    data: [
      { name: "قروب التسويق_2026-08-10", source: "public_group", sourceRef: "t.me/market_ksa", membersCount: 18420, status: "ready" },
      { name: "دعوة خاصة — دورة البرمجة", source: "invite", sourceRef: "t.me/+Ab12Cd34", membersCount: 932, status: "ready" },
      { name: "تفاعلات إعلان رمضان", source: "reactions", sourceRef: "msg/8821", membersCount: 641, status: "ready" },
      { name: "سجل رسائل الدعم", source: "messages", sourceRef: "t.me/support_hub", membersCount: 2204, status: "processing" },
      { name: "دمج أغسطس", source: "merge", sourceRef: "3 ملفات", membersCount: 24110, status: "ready" },
    ],
  });

  await prisma.job.createMany({
    data: [
      {
        type: "gather",
        status: "completed",
        title: "تجميع من قروب التسويق",
        progress: 18420,
        total: 18420,
        successCount: 17902,
        failCount: 318,
        skipCount: 200,
        startedAt: new Date(now - 1000 * 60 * 80),
        finishedAt: new Date(now - 1000 * 60 * 18),
        config: JSON.stringify({ source: "t.me/market_ksa" }),
        liveLog: JSON.stringify([{ t: new Date().toISOString(), level: "success", text: "اكتمل التجميع" }]),
      },
      {
        type: "add",
        status: "running",
        title: "إضافة دفعة أغسطس إلى قروب العملاء",
        progress: 146,
        total: 400,
        successCount: 128,
        failCount: 11,
        skipCount: 7,
        currentItem: "إضافة @user_392",
        startedAt: new Date(now - 1000 * 60 * 22),
        config: JSON.stringify({ target: "t.me/clients_vip" }),
        liveLog: JSON.stringify([
          { t: new Date().toISOString(), level: "success", text: "أُضيف عضو بنجاح" },
          { t: new Date().toISOString(), level: "warn", text: "FloodWait 18 ثانية" },
        ]),
      },
      {
        type: "warmup",
        status: "running",
        title: "تسخين حساب ريم المطيري",
        progress: 3,
        total: 7,
        successCount: 3,
        startedAt: new Date(now - 1000 * 60 * 60 * 50),
        config: JSON.stringify({ days: 7, intensity: "medium" }),
        liveLog: JSON.stringify([{ t: new Date().toISOString(), level: "info", text: "اليوم 3 من 7" }]),
      },
      {
        type: "health",
        status: "completed",
        title: "فحص صحة الأسطول",
        progress: 12,
        total: 12,
        successCount: 8,
        failCount: 4,
        startedAt: new Date(now - 1000 * 60 * 40),
        finishedAt: new Date(now - 1000 * 60 * 36),
        config: "{}",
        liveLog: JSON.stringify([{ t: new Date().toISOString(), level: "info", text: "اكتمل الفحص" }]),
      },
      {
        type: "add",
        status: "partial",
        title: "إضافة يدوية — قائمة VIP",
        progress: 40,
        total: 40,
        successCount: 27,
        failCount: 8,
        skipCount: 5,
        startedAt: new Date(now - 1000 * 60 * 60 * 26),
        finishedAt: new Date(now - 1000 * 60 * 60 * 25),
        config: "{}",
        liveLog: "[]",
      },
    ],
  });

  await prisma.campaign.createMany({
    data: [
      { kind: "dm", name: "ترحيب العملاء الجدد", status: "running", message: "مرحباً {{name}}، يسعدنا انضمامك.", targetsCount: 800, sentCount: 214, failCount: 19 },
      { kind: "dm", name: "عرض نهاية الأسبوع", status: "paused", message: "خصم 20٪ حتى الأحد فقط.", targetsCount: 1500, sentCount: 640, failCount: 41 },
      { kind: "dm", name: "تذكير السلة", status: "draft", message: "سلتك بانتظارك 👋", targetsCount: 220, sentCount: 0, failCount: 0 },
      { kind: "groups", name: "إعلان الدورة الجديدة", status: "running", message: "فتحنا التسجيل في الدورة — الرابط في التعليق الأول.", targetsCount: 48, sentCount: 12, failCount: 1 },
      { kind: "groups", name: "تهنئة العيد", status: "completed", message: "كل عام وأنتم بخير 🌙", targetsCount: 30, sentCount: 30, failCount: 0 },
    ],
  });

  await prisma.template.createMany({
    data: [
      { kind: "gather", name: "تجميع قروب عام سريع", content: JSON.stringify({ type: "public", filters: { photos: true } }) },
      { kind: "gather", name: "تفاعلات آخر منشور", content: JSON.stringify({ type: "reactions" }) },
      { kind: "message", name: "ترحيب رسمي", content: "أهلاً {{name}}، شكراً لتواصلك معنا." },
      { kind: "message", name: "عرض محدود", content: "عرض خاص لمدة 24 ساعة فقط." },
      { kind: "campaign", name: "إعلان قروب قصير", content: "فرصة جديدة اليوم — التفاصيل داخل القناة." },
    ],
  });

  await prisma.blacklist.createMany({
    data: [
      { value: "@spammer_x", kind: "user", reason: "بلاغات متكررة", scope: "global" },
      { value: "+966500000001", kind: "user", reason: "خصوصية مغلقة دائماً", scope: "add" },
      { value: "t.me/scam_deals", kind: "group", reason: "محتوى مخالف", scope: "global" },
      { value: "قرض فوري", kind: "word", reason: "كلمة محظورة", scope: "dm" },
    ],
  });

  await prisma.notification.createMany({
    data: [
      { title: "دخول جديد للوحة", body: "تم الدخول من 185.32.11.20 عبر Chrome", type: "info", href: "/settings/access" },
      { title: "تغيّرت حالة حسابين", body: "ماجد الغامدي أصبح مقيداً مؤقتاً — أمل الشهري غير قابلة للقياس", type: "warning", href: "/accounts/list" },
      { title: "بروكسي ميت ومعيَّن", body: "5.160.88.22 معيَّن لحساب أمل — استبدله فوراً", type: "danger", href: "/proxy/replace" },
      { title: "اكتمل تجميع قروب التسويق", body: "17,902 عضو صالح من أصل 18,420", type: "success", href: "/gather/files" },
    ],
  });

  const logRows = [
    { type: "gather", level: "success", message: "جُمع 420 عضواً من قروب التسويق", accountId: accounts[2].id },
    { type: "add", level: "warning", message: "FloodWait 32 ثانية أثناء الإضافة", accountId: accounts[4].id },
    { type: "add", level: "success", message: "أُضيف 14 عضواً إلى قروب العملاء", accountId: accounts[4].id },
    { type: "system", level: "info", message: "تم فحص صحة الأسطول — 8 نشط / 4 يحتاج مراجعة" },
    { type: "security", level: "error", message: "حساب تركي البقمي محظور نهائياً", accountId: accounts[10].id },
    { type: "dm", level: "success", message: "أُرسلت 40 رسالة ترحيب", accountId: accounts[9].id },
    { type: "proxy", level: "warning", message: "فشل بروكسي دبي 6 مرات متتالية" },
    { type: "warmup", level: "info", message: "اليوم 3 من تسخين ريم المطيري", accountId: accounts[5].id },
  ];
  for (const row of logRows) {
    await prisma.activityLog.create({ data: row });
  }

  await prisma.groupDirectory.createMany({
    data: [
      { title: "عملاء VIP", username: "clients_vip", members: 8420, type: "public" },
      { title: "دورة البرمجة", inviteLink: "t.me/+Ab12Cd34", members: 932, type: "private" },
      { title: "قناة العروض", username: "offers_daily", members: 22100, type: "channel" },
      { title: "مجتمع المسوقين", username: "market_ksa", members: 54000, type: "public" },
    ],
  });

  await prisma.loginAttempt.createMany({
    data: [
      { email: "admin@telecore.app", ip: "185.32.11.20", userAgent: "Chrome", success: true, reason: "ok" },
      { email: "admin@telecore.app", ip: "185.32.11.20", userAgent: "Chrome", success: true, reason: "ok" },
      { email: "admin@telecore.app", ip: "102.44.9.18", userAgent: "Firefox", success: false, reason: "كلمة مرور خاطئة" },
    ],
  });

  console.log("Seeded TeleCore demo data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
