import { json, requireUser } from "@/lib/http";
import { db } from "@/lib/store";
import { startJob } from "@/lib/jobs";

export async function GET() {
  const { res } = await requireUser();
  if (res) return res;
  return json({ jobs: db().jobs });
}

export async function POST(req: Request) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  const job = await startJob({
    type: body.type || "gather",
    title: body.title || "عملية جديدة",
    total: Number(body.total || 100),
    config: body.config,
  });
  return json({ job });
}
