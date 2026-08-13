"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Banner, Radio } from "@/components/ui";
import { api } from "@/lib/api-client";
import { useApi } from "@/components/data";

export default function GatherPublic() {
  const router = useRouter();
  const { data } = useApi<{accounts:any[]}>("/api/accounts");
  const [step,setStep]=useState(1);
  const [link,setLink]=useState("https://t.me/market_ksa");
  const [info,setInfo]=useState<any>(null);
  const [type,setType]=useState("recent");
  const [limit,setLimit]=useState("2000");
  const [accountId,setAccountId]=useState("");
  const [err,setErr]=useState("");
  async function analyze() {
    setErr("");
    if (!link.includes("t.me") && !link.startsWith("@")) { setErr("أدخل رابط قروب أو معرفاً مثل @name"); return; }
    setInfo({ title: "قروب التسويق", members: 54000, type: "عام", hidden: false });
    setStep(2);
  }
  async function start() {
    const job = await api<any>("/api/jobs",{method:"POST",body:JSON.stringify({type:"gather",title:`تجميع ${info.title}`,total:Number(limit),config:{link,type,accountId}})});
    router.push(`/reports/live/${job.job.id}`);
  }
  const accs = (data?.accounts||[]).filter((a:any)=>["active","premium"].includes(a.status));
  return (
    <div>
      <PageHeader title="تجميع من قروب عام" back="/gather" />
      {err && <Banner tone="danger">{err}</Banner>}
      {step===1 && (
        <Card className="space-y-3">
          <Field label="رابط القروب أو المعرف" hint="https://t.me/name أو @name">
            <Input value={link} onChange={e=>setLink(e.target.value)} />
          </Field>
          <Button className="w-full" onClick={analyze}>متابعة</Button>
        </Card>
      )}
      {step>=2 && info && (
        <div className="space-y-3">
          <Card>
            <div className="font-bold text-navy">{info.title}</div>
            <div className="text-sm text-ink-muted">{info.members.toLocaleString("ar-SA")} عضو · {info.type} · الأعضاء ظاهرة</div>
          </Card>
          <Card className="space-y-2">
            <div className="font-semibold">نوع التجميع</div>
            <Radio name="t" value="recent" checked={type==="recent"} onChange={setType} label="الأعضاء الظاهرون الآن" />
            <Radio name="t" value="all" checked={type==="all"} onChange={setType} label="محاولة أشمل (أبطأ)" />
            <Field label="الحد الأقصى"><Input type="number" value={limit} onChange={e=>setLimit(e.target.value)} /></Field>
            <Field label="حساب التجميع">
              <select className="field" value={accountId} onChange={e=>setAccountId(e.target.value)}>
                <option value="">اختيار تلقائي من التدوير</option>
                {accs.map((a:any)=><option key={a.id} value={a.id}>{a.firstName} — صحة {a.healthScore}%</option>)}
              </select>
            </Field>
            <Button className="w-full" onClick={start}>بدء التجميع</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
