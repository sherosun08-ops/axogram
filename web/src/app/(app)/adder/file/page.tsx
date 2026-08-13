"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Radio, Banner } from "@/components/ui";
import { AccountSelect, FileSelect, Feedback, Steps, useOp } from "@/components/prod";
import { useApi } from "@/components/data";

const STEPS = ["الملف", "الهدف", "الطريقة", "التوزيع", "العضوية", "الفلاتر", "الحماية", "التأكيد"];

export default function AddFromFile() {
  const router = useRouter();
  const op = useOp();
  const { data } = useApi<{ files: any[] }>("/api/files");
  const [step, setStep] = useState(0);
  const [fileId, setFileId] = useState("");
  const [target, setTarget] = useState("https://t.me/clients_vip");
  const [method, setMethod] = useState("add");
  const [accountId, setAccountId] = useState("");
  const [join, setJoin] = useState(true);
  const [skipExist, setSkipExist] = useState(true);
  const [skipBlack, setSkipBlack] = useState(true);
  const [onFlood, setOnFlood] = useState("wait");
  const file = (data?.files || []).find((f) => f.id === fileId);

  async function start() {
    const r: any = await op.run("start_add", {
      fileId,
      target,
      method,
      accountId,
      join,
      skipExist,
      skipBlack,
      onFlood,
      total: file?.membersCount || 200,
      title: `إضافة من ${file?.name || "ملف"}`,
    });
    router.push(`/reports/live/${r.job.id}`);
  }

  return (
    <div>
      <PageHeader title="الإضافة من ملف" back="/adder" subtitle="المسار الرئيسي — ثماني خطوات" />
      <Steps items={STEPS} step={step} />
      <Feedback err={op.err} />

      {step === 0 && (
        <Card className="space-y-3">
          <FileSelect value={fileId} onChange={setFileId} />
          {file && <div className="text-sm text-ink-muted">{file.membersCount} عضو · المصدر: {file.source}</div>}
          <Button className="w-full" disabled={!fileId} onClick={() => setStep(1)}>متابعة</Button>
        </Card>
      )}
      {step === 1 && (
        <Card className="space-y-3">
          <Field label="القروب الهدف"><Input value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
          <Button variant="ghost" onClick={() => setStep(0)}>رجوع</Button>
          <Button className="w-full" disabled={!target.includes("t.me") && !target.startsWith("@")} onClick={() => setStep(2)}>تحليل ومتابعة</Button>
        </Card>
      )}
      {step === 2 && (
        <Card className="space-y-3">
          <Radio name="m" value="add" checked={method === "add"} onChange={setMethod} label="إضافة مباشرة" hint="يتطلب صلاحية إضافة في القروب" />
          <Radio name="m" value="invite" checked={method === "invite"} onChange={setMethod} label="دعوة عبر رسالة خاصة" hint="عندما تكون الإضافة مقفلة" />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>رجوع</Button>
            <Button className="flex-1" onClick={() => setStep(3)}>متابعة</Button>
          </div>
        </Card>
      )}
      {step === 3 && (
        <Card className="space-y-3">
          <AccountSelect value={accountId} onChange={setAccountId} filter={(a) => ["active", "premium"].includes(a.status)} label="حسابات الإضافة — أو اتركه للتدوير" />
          <Banner tone="info">نظام التدوير يوزّع الحمل تلقائياً إن لم تختر حساباً</Banner>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(2)}>رجوع</Button>
            <Button className="flex-1" onClick={() => setStep(4)}>متابعة</Button>
          </div>
        </Card>
      )}
      {step === 4 && (
        <Card className="space-y-3">
          <Radio name="j" value="y" checked={join} onChange={() => setJoin(true)} label="انضم تلقائياً إن لم يكن الحساب عضواً" />
          <Radio name="j" value="n" checked={!join} onChange={() => setJoin(false)} label="أوقف العملية إن لم يكن عضواً" />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(3)}>رجوع</Button>
            <Button className="flex-1" onClick={() => setStep(5)}>متابعة</Button>
          </div>
        </Card>
      )}
      {step === 5 && (
        <Card className="space-y-3">
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={skipExist} onChange={(e) => setSkipExist(e.target.checked)} /> تخطي الموجودين في القروب</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" checked={skipBlack} onChange={(e) => setSkipBlack(e.target.checked)} /> تخطي القائمة السوداء</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> تخطي البوتات والخصوصية المغلقة</label>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(4)}>رجوع</Button>
            <Button className="flex-1" onClick={() => setStep(6)}>متابعة</Button>
          </div>
        </Card>
      )}
      {step === 6 && (
        <Card className="space-y-3">
          <div className="font-semibold">عند FloodWait</div>
          <Radio name="f" value="wait" checked={onFlood === "wait"} onChange={setOnFlood} label="انتظار ثم متابعة" />
          <Radio name="f" value="switch" checked={onFlood === "switch"} onChange={setOnFlood} label="تبديل حساب فوراً" />
          <Radio name="f" value="stop" checked={onFlood === "stop"} onChange={setOnFlood} label="إيقاف العملية" />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(5)}>رجوع</Button>
            <Button className="flex-1" onClick={() => setStep(7)}>متابعة</Button>
          </div>
        </Card>
      )}
      {step === 7 && (
        <Card className="space-y-3">
          <div className="font-bold">الملخص</div>
          <ul className="text-sm text-ink-muted space-y-1">
            <li>الملف: {file?.name} ({file?.membersCount})</li>
            <li>الهدف: {target}</li>
            <li>الطريقة: {method === "add" ? "إضافة مباشرة" : "دعوة خاصة"}</li>
            <li>الحماية: {onFlood}</li>
          </ul>
          <Button className="w-full" disabled={op.busy} onClick={start}>{op.busy ? "جاري..." : "بدء الإضافة"}</Button>
        </Card>
      )}
    </div>
  );
}
