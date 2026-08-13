import { getSettingsMap } from "@/lib/auth";
import { json, requireUser } from "@/lib/http";
import { db } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  const data = db();
  const statusCount = (s: string) => data.accounts.filter((a) => a.status === s).length;
  const fleetHealth = data.accounts.length
    ? Math.round(data.accounts.reduce((s, a) => s + a.healthScore, 0) / data.accounts.length)
    : 0;
  return json({
    settings: await getSettingsMap(),
    fleetHealth,
    counts: {
      accounts: data.accounts.length,
      active: statusCount("active") + statusCount("premium"),
      restricted: statusCount("restricted_temp") + statusCount("restricted_perm"),
      banned: statusCount("banned"),
      dead: statusCount("dead_session"),
      frozen: statusCount("frozen"),
      unmeasurable: statusCount("unmeasurable"),
      proxies: data.proxies.length,
      proxiesAlive: data.proxies.filter((p) => p.status === "alive").length,
      files: data.memberFiles.length,
      runningJobs: data.jobs.filter((j) => j.status === "running").length,
      dmActive: data.campaigns.filter((c) => c.kind === "dm" && c.status === "running").length,
      groupActive: data.campaigns.filter((c) => c.kind === "groups" && c.status === "running").length,
      unread: data.notifications.filter((n) => !n.read).length,
    },
    jobs: data.jobs.slice(0, 8),
    lastGather: data.memberFiles[0] || null,
    lastAdd: data.jobs.find((j) => j.type === "add") || null,
  });
}
