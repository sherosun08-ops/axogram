"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Radio, Banner } from "@/components/ui";
import { AccountSelect, Feedback, Steps, useOp } from "@/components/prod";

const STEPS = ["الرابط", "النوع", "الفلاتر", "الحد", "الحساب", "العضوية", "التأكيد"];

export default function GatherPublic() {
  const router = useRouter();
  const op = useOp();
  const [step, setStep] = useState(0);
  const [link, setLink] = useState("https://t.me/market_ksa");
  const [info, setInfo] = useState<any>(null);
  const [type, setType] = useState("recent");
  const [photos, setPhotos] = useState(true);
  const [noBots, setNoBots] = useState(true);
  const [limit, setLimit] = useState("2000");
  const [fields, setFields] = useState({ username: true, id: true, phone: false, lastSeen: true });
  const [accountId, setAccountId] = useState("");
  const [join, setJoin] = useState(true);

  async function analyze() {
    const r: any = await op.run("analyze_group", { link });
    setInfo(r.group);
    setStep(1);
  }

  async function start() {
    const r: any = await op.run("start_gather", {
      link,
      type,
      limit,
      accountId,
      photos,
      noBots,
      fields,
      join,
      source: info?.title,
    });
    router.push(`/reports/live/${r.job.id}`);
  }

  return (
    <div>
      <PageHeader title="تجميع من قروب عام" back="/gather" subtitle="سبعة خطوات — من الرابط حتى التنفيذ" />
      <Steps items={STEPS} step={step} />
      <Feedback err={op.err} />

      {step === 0 && (
        <Card className="space-y-3">
          <Field label="رابط القروب أو المعرف" hint="https://t.me/name أو @name">
            <Input value={link} onChange={(e) => setLink(e.target.value)} />
          </Field>
          <Banner tone="info">إن كانت القائمة مخفية سيُقترح التجميع من الرسائل أو التفاعلات</Banner>
          <Button className="w-full" disabled={!link || op.busy} onClick={analyze}>
            {op.busy ? "جاري التحليل..." : "تحليل الرابط"}
          </Button>
        </Card>
      )}

      {step === 1 && info && (
        <Card className="space-y-3">
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <div className="font-bold text-navy">{info.title}</div>
            <div className="text-ink-muted">
              {info.members.toLocaleString("ar-SA")} عضو · {info.type} · {info.hidden ? "قائمة مخفية" : "الأعضاء ظاهرة"}
            </div>
          </div>
          {info.hidden && <Banner tone="warning">القائمة مخفية — انتقل لتجميع الرسائل أو التفاعلات</Banner>}
          <Radio name="t" value="recent" checked={type === "recent"} onChange={setType} label="الأعضاء الظاهرون الآن" hint="أسرع وأأمن" />
          <Radio name="t" value="all" checked={type === "all"} onChange={setType} label="محاولة أشمل" hint="أبطأ وقد يسبب FloodWait" />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(0)}>رجوع</Button>
            <Button className="flex-1" disabled={info.hidden} onClick={() => setStep(2)}>متابعة</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="space-y-3">
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={photos} onChange={(e) => setPhotos(e.target.checked)} /> لديهم صورة شخصية</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={noBots} onChange={(e) => setNoBots(e.target.checked)} /> استبعاد البوتات</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> استبعاد المحذوفين</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" /> آخر ظهور خلال 7 أيام</label>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>رجوع</Button>
            <Button className="flex-1" onClick={() => setStep(3)}>متابعة</Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="space-y-3">
          <div className="font-semibold">البيانات المطلوبة</div>
          {Object.entries({ username: "اليوزرنيم", id: "المعرّف", phone: "رقم الهاتف إن ظهر", lastSeen: "آخر ظهور" }).map(([k, l]) => (
            <label key={k} className="flex gap-2 text-sm">
              <input type="checkbox" checked={(fields as any)[k]} onChange={(e) => setFields({ ...fields, [k]: e.target.checked })} /> {l}
            </label>
          ))}
          <Field label="الحد الأقصى" hint="أكثر من 5000 يزيد خطر FloodWait">
            <Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} />
          </Field>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(2)}>رجوع</Button>
            <Button className="flex-1" onClick={() => setStep(4)}>متابعة</Button>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card className="space-y-3">
          <AccountSelect value={accountId} onChange={setAccountId} filter={(a) => ["active", "premium"].includes(a.status) && a.allowGather !== false} label="حساب التجميع" />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(3)}>رجوع</Button>
            <Button className="flex-1" onClick={() => setStep(5)}>متابعة</Button>
          </div>
        </Card>
      )}

      {step === 5 && (
        <Card className="space-y-3">
          <Radio name="j" value="yes" checked={join} onChange={() => setJoin(true)} label="ضمان العضوية — انضم إن لم يكن الحساب عضواً" />
          <Radio name="j" value="no" checked={!join} onChange={() => setJoin(false)} label="لا تنضم — أوقف إن لم يكن عضواً" />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(4)}>رجوع</Button>
            <Button className="flex-1" onClick={() => setStep(6)}>متابعة</Button>
          </div>
        </Card>
      )}

      {step === 6 && (
        <Card className="space-y-3">
          <div className="font-bold text-navy">ملخص العملية</div>
          <ul className="space-y-1 text-sm text-ink-muted">
            <li>المصدر: {info?.title}</li>
            <li>النوع: {type === "recent" ? "ظاهرون الآن" : "شامل"}</li>
            <li>الحد: {limit}</li>
            <li>الفلاتر: {photos ? "صورة · " : ""}{noBots ? "بدون بوتات" : ""}</li>
            <li>ضمان العضوية: {join ? "نعم" : "لا"}</li>
          </ul>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(5)}>تعديل</Button>
            <Button className="flex-1" disabled={op.busy} onClick={start}>{op.busy ? "جاري البدء..." : "بدء التجميع"}</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
