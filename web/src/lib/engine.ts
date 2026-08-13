import { createId, db, persist, withAccount } from "./store";
import { startJob } from "./jobs";

function now() {
  return new Date().toISOString();
}

function log(type: string, level: string, message: string, accountId?: string, details?: string) {
  db().activityLogs.unshift({ id: createId(), type, level, message, accountId, details, createdAt: now() });
}

function notify(title: string, body: string, type = "info", href?: string) {
  db().notifications.unshift({ id: createId(), title, body, type, read: false, href, createdAt: now() });
}

export function ensureExtras() {
  const d = db() as any;
  d.devices ||= [];
  d.switchLogs ||= [];
  d.securityEvents ||= [];
  d.deferred ||= [];
  d.schedules ||= [];
  d.archives ||= [];
  d.members ||= [];
  d.skipped ||= [];
}

export async function runOp(action: string, payload: any = {}) {
  ensureExtras();
  const d = db() as any;

  switch (action) {
    case "analyze_group": {
      const link = String(payload.link || "").trim();
      if (!link) throw new Error("أدخل رابط القروب أو المعرف");
      const hidden = /invite|\+/.test(link);
      return {
        ok: true,
        group: {
          title: hidden ? "قروب خاص" : link.replace(/https?:\/\/t\.me\//, "@").replace("https://", ""),
          members: hidden ? 932 : 54000,
          type: hidden ? "خاص" : "عام",
          hidden,
          username: link,
        },
      };
    }
    case "start_gather": {
      const total = Number(payload.limit || 2000);
      const job = await startJob({
        type: "gather",
        title: `تجميع ${payload.source || payload.link || "قروب"}`,
        total,
        config: payload,
      });
      log("gather", "info", `بدأت عملية تجميع (${total})`);
      return { job };
    }
    case "clean_file": {
      const file = d.memberFiles.find((f: any) => f.id === payload.fileId);
      if (!file) throw new Error("الملف غير موجود");
      const before = file.membersCount;
      let next = before;
      if (payload.dupes) next = Math.floor(next * 0.92);
      if (payload.noUsername) next = Math.floor(next * 0.88);
      if (payload.bots) next = Math.floor(next * 0.97);
      if (payload.black) next = Math.max(0, next - 12);
      file.membersCount = next;
      file.status = next === 0 ? "empty" : "ready";
      persist();
      log("gather", "success", `تنقية ${file.name}: ${before} ← ${next}`);
      return { file, before, after: next, removed: before - next };
    }
    case "merge_files": {
      const files = d.memberFiles.filter((f: any) => (payload.ids || []).includes(f.id));
      if (files.length < 2) throw new Error("اختر ملفين على الأقل");
      const raw = files.reduce((s: number, f: any) => s + f.membersCount, 0);
      const merged = Math.floor(raw * 0.86);
      const file = {
        id: createId(),
        name: `دمج ${new Date().toISOString().slice(0, 10)}`,
        source: "merge",
        sourceRef: `${files.length} ملفات`,
        membersCount: merged,
        status: "ready",
        createdAt: now(),
      };
      d.memberFiles.unshift(file);
      persist();
      return { file, raw, merged };
    }
    case "start_add": {
      const total = Number(payload.total || 200);
      const job = await startJob({
        type: "add",
        title: payload.title || `إضافة إلى ${payload.target || "قروب هدف"}`,
        total,
        config: payload,
      });
      log("add", "info", `بدأت الإضافة إلى ${payload.target || "هدف"}`);
      return { job };
    }
    case "verify_members": {
      const lines = String(payload.raw || "")
        .split(/\n/)
        .map((s: string) => s.trim())
        .filter(Boolean);
      if (!lines.length) throw new Error("أدخل معرفاً واحداً على الأقل");
      const results = lines.map((v: string, i: number) => {
        const roll = (i * 17 + v.length) % 7;
        const status = roll === 0 ? "black" : roll === 1 ? "bot" : roll === 2 ? "missing" : "ok";
        return { value: v, status };
      });
      return { results, ok: results.filter((r: any) => r.status === "ok").length };
    }
    case "reset_counters": {
      const scope = payload.scope || "all";
      let n = 0;
      d.accounts.forEach((a: any) => {
        if (scope === "group" && a.groupId !== payload.groupId) return;
        if (scope === "ids" && !(payload.ids || []).includes(a.id)) return;
        a.usedAdd = 0;
        a.usedGather = 0;
        a.usedDm = 0;
        a.usedCampaign = 0;
        n++;
      });
      d.rotationSlots.forEach((s: any) => {
        if (scope === "ids" && !(payload.ids || []).includes(s.accountId)) return;
        s.usedToday = 0;
        if (s.state === "exhausted") s.state = "ready";
      });
      persist();
      log("system", "success", `تم تصفير عدادات ${n} حساب`);
      return { count: n };
    }
    case "reorder_rotation": {
      const ids: string[] = payload.ids || [];
      ids.forEach((id, i) => {
        const s = d.rotationSlots.find((x: any) => x.id === id || x.accountId === id);
        if (s) s.order = i + 1;
      });
      persist();
      return { ok: true };
    }
    case "switch_account": {
      const to = payload.toAccountId;
      const current = d.rotationSlots.find((s: any) => s.state === "active");
      const next = d.rotationSlots.find((s: any) => s.accountId === to);
      if (!next) throw new Error("الحساب غير موجود في الدورة");
      if (current) current.state = "ready";
      next.state = "active";
      d.switchLogs.unshift({
        id: createId(),
        from: current?.accountId,
        to,
        reason: payload.reason || "تبديل يدوي",
        createdAt: now(),
      });
      persist();
      return { ok: true };
    }
    case "exclude_slot": {
      const s = d.rotationSlots.find((x: any) => x.accountId === payload.accountId);
      if (s) s.state = payload.state || "excluded";
      persist();
      return { ok: true };
    }
    case "import_proxies": {
      const lines = String(payload.raw || "")
        .split(/\n/)
        .map((s: string) => s.trim())
        .filter(Boolean);
      if (!lines.length) throw new Error("القائمة فارغة");
      const added = [];
      for (const line of lines) {
        const [host, port, username, password] = line.split(":");
        if (!host || !port) continue;
        const proxy = {
          id: createId(),
          host,
          port: Number(port),
          type: payload.type || "socks5",
          username: username || null,
          password: password || null,
          status: payload.test ? (Math.random() < 0.15 ? "dead" : "alive") : "unknown",
          latencyMs: payload.test ? 20 + Math.floor(Math.random() * 80) : null,
          failCount: 0,
          createdAt: now(),
        };
        d.proxies.unshift(proxy);
        added.push(proxy);
      }
      persist();
      return { added: added.length, proxies: added };
    }
    case "assign_proxies": {
      const mode = payload.mode || "smart";
      const alive = d.proxies.filter((p: any) => p.status === "alive");
      const accs = d.accounts.filter((a: any) => ["active", "premium", "warming", "unmeasurable"].includes(a.status));
      let i = 0;
      accs.forEach((a: any) => {
        if (!alive.length) return;
        if (mode === "manual" && payload.map?.[a.id]) {
          a.proxyId = payload.map[a.id];
        } else {
          a.proxyId = alive[i % alive.length].id;
          i++;
        }
      });
      persist();
      return { assigned: accs.length };
    }
    case "replace_dead": {
      const deadAssigned = d.accounts.filter((a: any) => {
        const p = d.proxies.find((x: any) => x.id === a.proxyId);
        return p && p.status === "dead";
      });
      const alive = d.proxies.filter((p: any) => p.status === "alive");
      if (!alive.length) throw new Error("لا بروكسي حي متاح للاستبدال");
      deadAssigned.forEach((a: any, i: number) => {
        a.proxyId = alive[i % alive.length].id;
      });
      persist();
      notify("استبدال بروكسي ميت", `تم استبدال ${deadAssigned.length} تعيين`, "success", "/proxy/list");
      return { replaced: deadAssigned.length };
    }
    case "check_all_proxies": {
      const job = await startJob({ type: "proxy_check", title: "فحص صحة البروكسيهات", total: d.proxies.length || 8, config: payload });
      return { job };
    }
    case "security_scan": {
      const job = await startJob({ type: "security", title: "فحص أمان شامل", total: d.accounts.length || 12, config: payload });
      return { job };
    }
    case "spambot": {
      const acc = d.accounts.find((a: any) => a.id === payload.accountId);
      if (!acc) throw new Error("اختر حساباً");
      const map: Record<string, string> = {
        restricted_temp: "مقيد مؤقتاً حتى تاريخ محدد",
        restricted_perm: "قيد دائم من تيليجرام",
        banned: "محظور نهائياً",
        frozen: "الحساب مجمّد — قراءة فقط",
      };
      const verdict = map[acc.status] || "لا قيود على هذا الحساب";
      log("security", acc.status === "active" ? "success" : "warning", `SpamBot: ${acc.firstName} — ${verdict}`, acc.id);
      return { account: withAccount(acc), verdict };
    }
    case "list_devices": {
      const acc = d.accounts.find((a: any) => a.id === payload.accountId);
      if (!acc) throw new Error("اختر حساباً");
      const devices = [
        { id: createId(), name: "Telegram Desktop", ip: "185.32.11.44", current: true, last: now() },
        { id: createId(), name: "Chrome Web", ip: "102.44.18.9", current: false, last: new Date(Date.now() - 86400e3).toISOString() },
        { id: createId(), name: "Android", ip: "37.211.55.14", current: false, last: new Date(Date.now() - 3 * 86400e3).toISOString() },
      ];
      return { account: acc, devices };
    }
    case "terminate_device": {
      log("security", "warning", `أُنهي جهاز ${payload.name || ""}`, payload.accountId);
      return { ok: true };
    }
    case "cleanup_account": {
      const job = await startJob({
        type: "cleanup",
        title: `تنظيف حسابات`,
        total: Number(payload.count || 20),
        config: payload,
      });
      return { job };
    }
    case "set_2fa": {
      const acc = d.accounts.find((a: any) => a.id === payload.accountId);
      if (!acc) throw new Error("اختر حساباً");
      acc.twoFA = true;
      persist();
      log("security", "success", `تحديث 2FA لـ ${acc.firstName}`, acc.id);
      return { ok: true };
    }
    case "emergency": {
      const kind = payload.kind;
      if (kind === "stop") {
        d.jobs.forEach((j: any) => {
          if (j.status === "running") j.status = "paused";
        });
        persist();
        return { message: "أُوقفت كل العمليات الجارية" };
      }
      if (kind === "lock") {
        d.systemSettings.emergency_lock = "1";
        persist();
        notify("قفل طوارئ", "النظام مقفل طوارئياً", "danger", "/security/emergency");
        return { message: "تم قفل النظام طوارئياً" };
      }
      if (kind === "unlock") {
        d.systemSettings.emergency_lock = "0";
        persist();
        return { message: "تم فك القفل" };
      }
      if (kind === "wipe_sessions") {
        log("security", "error", "حذف طارئ لملفات الجلسات من الأداة");
        return { message: "أُرشفت الجلسات محلياً وأُزيلت من المسار الحي" };
      }
      throw new Error("إجراء غير معروف");
    }
    case "export_csv": {
      const tables = payload.tables || ["accounts"];
      const rows: Record<string, any[]> = {};
      if (tables.includes("accounts")) rows.accounts = d.accounts.map((a: any) => ({ name: `${a.firstName} ${a.lastName || ""}`, phone: a.phone, status: a.status, health: a.healthScore }));
      if (tables.includes("proxies")) rows.proxies = d.proxies.map((p: any) => ({ host: p.host, port: p.port, status: p.status, country: p.country }));
      if (tables.includes("jobs")) rows.jobs = d.jobs.map((j: any) => ({ title: j.title, type: j.type, status: j.status, success: j.successCount }));
      return { rows, filename: `telecore-export-${Date.now()}.json` };
    }
    case "backup": {
      const blob = {
        at: now(),
        accounts: d.accounts.length,
        proxies: d.proxies.length,
        settings: d.systemSettings,
      };
      d.archives.unshift({ id: createId(), name: `نسخة_${now().slice(0, 10)}`, size: "2.4 MB", encrypted: !!payload.encrypt, createdAt: now(), meta: blob });
      persist();
      return { archive: d.archives[0] };
    }
    case "restore": {
      return { message: "تمت محاكاة الاستعادة — النسخة محللة وجاهزة" };
    }
    case "create_template": {
      if (!payload.name) throw new Error("اسم القالب مطلوب");
      const t = { id: createId(), kind: payload.kind || "message", name: payload.name, content: payload.content || "", createdAt: now() };
      d.templates.unshift(t);
      persist();
      return { template: t };
    }
    case "create_schedule": {
      const s = { id: createId(), kind: payload.kind || "campaign", title: payload.title, at: payload.at, repeat: payload.repeat || "none", createdAt: now() };
      d.schedules.unshift(s);
      persist();
      return { schedule: s };
    }
    case "discover_groups": {
      const q = String(payload.q || "").trim();
      if (!q) throw new Error("أدخل كلمات البحث");
      const results = [
        { title: `${q} — مجتمع`, username: `${q}_hub`, members: 22100, type: "public" },
        { title: `قناة ${q}`, username: `${q}_news`, members: 8800, type: "channel" },
        { title: `${q} VIP`, username: null, members: 640, type: "private" },
        { title: `عروض ${q}`, username: `${q}_deals`, members: 15400, type: "public" },
      ];
      return { results };
    }
    case "visibility": {
      const link = String(payload.link || "");
      if (!link) throw new Error("أدخل الرابط");
      const hidden = /invite|\+/.test(link);
      return { hidden, message: hidden ? "قائمة الأعضاء مخفية — استخدم الرسائل أو التفاعلات" : "الأعضاء ظاهرة — يمكن التجميع المباشر" };
    }
    case "recalc_health": {
      d.accounts.forEach((a: any) => {
        if (a.status === "banned") a.healthScore = 8;
        else if (a.status === "dead_session") a.healthScore = 30;
        else a.healthScore = Math.min(99, Math.max(20, a.healthScore + (Math.random() < 0.5 ? 1 : -1)));
      });
      persist();
      return { ok: true };
    }
    case "extend_limit": {
      const acc = d.accounts.find((a: any) => a.id === payload.accountId);
      if (!acc) throw new Error("الحساب غير موجود");
      acc.dailyAddLimit = Number(payload.limit || acc.dailyAddLimit);
      persist();
      return { account: acc };
    }
    case "apply_preset": {
      const presets: Record<string, any> = {
        conservative: { mode: "sequential", switchAfter: 5, restAfter: 10, restMinutes: 30 },
        balanced: { mode: "smart", switchAfter: 10, restAfter: 20, restMinutes: 20 },
        aggressive: { mode: "random", switchAfter: 20, restAfter: 40, restMinutes: 8 },
        night: { mode: "smart", workFrom: "22:00", workTo: "06:00" },
      };
      const p = presets[payload.id];
      if (!p) throw new Error("سيناريو غير معروف");
      Object.assign(d.rotationSettings[0], p);
      persist();
      return { settings: d.rotationSettings[0] };
    }
    default:
      throw new Error("عملية غير معروفة");
  }
}
