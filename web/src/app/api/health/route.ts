import { json } from "@/lib/http";

export async function GET() {
  return json({ ok: true, name: "TeleCore", version: "1.0.0" });
}
