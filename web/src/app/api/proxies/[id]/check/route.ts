import { json, requireUser, error } from "@/lib/http";
import { db, persist } from "@/lib/store";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const proxy = db().proxies.find((p) => p.id === params.id);
  if (!proxy) return error("البروكسي غير موجود", 404);
  const roll = Math.random();
  const status = roll < 0.12 ? "dead" : roll < 0.22 ? "slow" : "alive";
  proxy.status = status;
  proxy.latencyMs = status === "dead" ? null : status === "slow" ? 280 + Math.floor(Math.random() * 200) : 18 + Math.floor(Math.random() * 70);
  proxy.failCount = status === "dead" ? (proxy.failCount || 0) + 1 : 0;
  proxy.lastCheckedAt = new Date().toISOString();
  persist();
  return json({ proxy, message: status === "alive" ? "البروكسي يعمل" : status === "slow" ? "البروكسي بطيء" : "البروكسي ميت" });
}
