import { getSession, getSettingsMap } from "@/lib/auth";
import { error, json } from "@/lib/http";

export async function GET() {
  const user = await getSession();
  if (!user) return error("غير مصرح", 401);
  const settings = await getSettingsMap();
  return json({ user, settings });
}
