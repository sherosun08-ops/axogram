import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { COOKIE_NAME } from "./constants";
import { db, persist } from "./store";

export { COOKIE_NAME };

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "telecore-dev-secret-change-in-production-2026"
);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: { userId: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as { userId: string; email: string };
}

export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = await verifyToken(token);
    const user = db().users.find((u) => u.id === payload.userId);
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    return null;
  }
}

export async function getSettingsMap() {
  return { ...db().systemSettings };
}

export async function getSetting(key: string, fallback = "") {
  return db().systemSettings[key] ?? fallback;
}

export async function setSetting(key: string, value: string) {
  db().systemSettings[key] = value;
  persist();
}

export function isApiConfigured(settings: Record<string, string>) {
  return Boolean(settings.api_id && settings.api_hash);
}
