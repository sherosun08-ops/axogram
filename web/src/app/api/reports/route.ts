import { json, requireUser } from "@/lib/http";
import { db } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  const data = db();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todays = data.jobs.filter((j) => new Date(j.createdAt) >= today);
  const byType = (t: string) => data.jobs.filter((j) => j.type === t);
  return json({
    jobs: data.jobs,
    logs: data.activityLogs.slice(0, 80).map((l) => ({ ...l, account: data.accounts.find((a) => a.id === l.accountId) || null })),
    accounts: data.accounts,
    campaigns: data.campaigns,
    summary: {
      todayJobs: todays.length,
      todaySuccess: todays.reduce((s, j) => s + j.successCount, 0),
      todayFail: todays.reduce((s, j) => s + j.failCount, 0),
      running: data.jobs.filter((j) => j.status === "running").length,
      gather: byType("gather").reduce((s, j) => s + j.successCount, 0),
      add: byType("add").reduce((s, j) => s + j.successCount, 0),
      fleet: data.accounts.length ? Math.round(data.accounts.reduce((s, a) => s + a.healthScore, 0) / data.accounts.length) : 0,
    },
  });
}
