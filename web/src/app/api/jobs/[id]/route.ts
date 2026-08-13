import { error, json, requireUser } from "@/lib/http";
import { db, persist } from "@/lib/store";
import { tickJob } from "@/lib/jobs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const job = await tickJob(params.id);
  if (!job) return error("العملية غير موجودة", 404);
  return json({ job });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { res } = await requireUser();
  if (res) return res;
  const body = await req.json();
  const job = db().jobs.find((j) => j.id === params.id);
  if (!job) return error("العملية غير موجودة", 404);
  job.status = body.status;
  if (["cancelled", "completed", "failed"].includes(body.status)) job.finishedAt = new Date().toISOString();
  persist();
  return json({ job });
}
