import { createId, db, persist } from "./store";

type LogItem = { t: string; level: string; text: string };

function pushLog(raw: string, item: LogItem) {
  const list: LogItem[] = JSON.parse(raw || "[]");
  list.unshift(item);
  return JSON.stringify(list.slice(0, 80));
}

export async function tickJob(id: string) {
  const job = db().jobs.find((j) => j.id === id);
  if (!job || job.status !== "running") return job;

  const step = Math.max(1, Math.ceil(job.total / 18));
  const nextProgress = Math.min(job.total, job.progress + step);
  const successInc = Math.max(0, nextProgress - job.progress - (Math.random() < 0.12 ? 1 : 0));
  const failInc = nextProgress - job.progress - successInc;
  const done = nextProgress >= job.total;
  const samples = [
    { level: "success", text: "تمت معالجة عنصر بنجاح" },
    { level: "info", text: "جاري العمل على الدفعة التالية" },
    { level: "warn", text: "FloodWait قصير — انتظار ثم متابعة" },
    { level: "error", text: "تخطي عنصر بسبب خصوصية مغلقة" },
  ];
  const sample = samples[Math.floor(Math.random() * samples.length)];

  job.progress = nextProgress;
  job.successCount += successInc;
  job.failCount += Math.max(0, failInc);
  job.currentItem = done ? null : `عنصر ${nextProgress} / ${job.total}`;
  job.status = done ? (job.failCount > 0 ? "partial" : "completed") : "running";
  job.finishedAt = done ? new Date().toISOString() : null;
  job.liveLog = pushLog(job.liveLog, { t: new Date().toISOString(), level: sample.level, text: sample.text });
  persist();
  return job;
}

export async function startJob(data: { type: string; title: string; total?: number; config?: unknown }) {
  const job = {
    id: createId(),
    type: data.type,
    title: data.title,
    total: data.total ?? 100,
    progress: 0,
    successCount: 0,
    failCount: 0,
    skipCount: 0,
    status: "running",
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    config: JSON.stringify(data.config ?? {}),
    liveLog: JSON.stringify([{ t: new Date().toISOString(), level: "info", text: "بدأت العملية" }]),
    currentItem: null,
    finishedAt: null,
  };
  db().jobs.unshift(job);
  persist();
  return job;
}
