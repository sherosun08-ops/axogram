import { getSettingsMap, setSetting } from "@/lib/auth";
import { json, requireUser } from "@/lib/http";
import { db } from "@/lib/store";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  const data = db();
  return json({
    settings: await getSettingsMap(),
    users: data.users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role, createdAt: u.createdAt })),
    attempts: data.loginAttempts.slice(0, 30),
    stats: {
      accounts: data.accounts.length,
      proxies: data.proxies.length,
      jobs: data.jobs.length,
      logs: data.activityLogs.length,
    },
  });
}

export async function PATCH(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  for (const [key, value] of Object.entries(body || {})) {
    await setSetting(key, String(value));
  }
  return json({ ok: true, settings: await getSettingsMap() });
}
