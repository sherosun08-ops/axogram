import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/constants";
import { db, persist } from "@/lib/store";
import { json } from "@/lib/http";

export async function POST() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) {
    const data = db();
    data.sessions = data.sessions.filter((s) => s.token !== token);
    persist();
  }
  const res = json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
