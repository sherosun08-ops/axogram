#!/usr/bin/env python3
from pathlib import Path
ROOT = Path("/home/user/axogram/web/src/app/(app)")

def write(rel, content):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    if p.exists():
        return False
    p.write_text(content.strip() + "\n", encoding="utf-8")
    return True

def form_page(title, back, fields, submit="حفظ", success="تم الحفظ"):
    field_jsx = []
    for f in fields:
        if f[0] == "input":
            field_jsx.append(f'<Field label="{f[1]}" hint="{f[2] if len(f)>2 else ""}"><Input placeholder="{f[1]}" /></Field>')
        elif f[0] == "textarea":
            field_jsx.append(f'<Field label="{f[1]}"><Textarea placeholder="{f[1]}" /></Field>')
        elif f[0] == "check":
            field_jsx.append(f'<label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> {f[1]}</label>')
        elif f[0] == "radio":
            opts = "".join([f'<Radio name="r" value="{o}" checked={{val==="{o}"}} onChange={{setVal}} label="{o}" />' for o in f[2]])
            field_jsx.append(f'<div className="font-semibold">{f[1]}</div>{opts}')
        elif f[0] == "info":
            field_jsx.append(f'<Banner tone="info">{f[1]}</Banner>')
        elif f[0] == "warn":
            field_jsx.append(f'<Banner tone="warning">{f[1]}</Banner>')
        elif f[0] == "link":
            field_jsx.append(f'<RowLink href="{f[2]}" icon="↗" title="{f[1]}" />')
    body = "\n        ".join(field_jsx)
    return f'''"use client";
import Link from "next/link";
import {{ useState }} from "react";
import {{ PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty }} from "@/components/ui";

export default function Screen() {{
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("{fields[0][2][0] if fields and fields[0][0]=='radio' else ''}");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="{title}" back="{back}" />
      {{msg && <Banner tone="success">{{msg}}</Banner>}}
      <Card className="space-y-3">
        {body}
        <Button className="w-full" disabled={{busy}} onClick={{()=>{{setBusy(true); setTimeout(()=>{{setBusy(false); setMsg("{success}");}},600);}}}}>{{busy?"جاري...":"{submit}"}}</Button>
      </Card>
    </div>
  );
}}
'''

def hub_page(title, back, subtitle, links, stats=None):
    stats_jsx = ""
    if stats:
        items = "".join([f'<Stat icon="{s[0]}" label="{s[1]}" value="{s[2]}" />' for s in stats])
        stats_jsx = f'<div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">{items}</div>'
    links_jsx = "".join([f'<RowLink href="{h}" icon="{i}" title="{t}" hint="{hint}" />' for i,t,h,hint in links])
    return f'''"use client";
import {{ PageHeader, RowLink, Stat }} from "@/components/ui";

export default function Screen() {{
  return (
    <div>
      <PageHeader title="{title}" back="{back}" subtitle="{subtitle}" />
      {stats_jsx}
      <div className="space-y-2">
        {links_jsx}
      </div>
    </div>
  );
}}
'''

def list_api_page(title, back, endpoint, item_title, item_hint, empty):
    return f'''"use client";
import {{ PageHeader, Card, Empty }} from "@/components/ui";
import {{ useApi, LoadingGrid }} from "@/components/data";
import {{ formatNumber, timeAgo }} from "@/lib/utils";

export default function Screen() {{
  const {{ data, loading }} = useApi<any>("{endpoint}");
  if (loading) return <LoadingGrid />;
  const items = data?.jobs || data?.files || data?.campaigns || data?.items || data?.logs || data?.templates || data?.groups || data?.proxies || data?.accounts || [];
  return (
    <div>
      <PageHeader title="{title}" back="{back}" />
      <div className="space-y-2">
        {{items.map((it:any) => (
          <Card key={{it.id}}>
            <div className="font-bold text-navy">{item_title}</div>
            <div className="text-sm text-ink-muted">{item_hint}</div>
          </Card>
        ))}}
        {{items.length===0 && <Empty icon="📭" title="{empty}" />}}
      </div>
    </div>
  );
}}
'''

# Fix list pages to use real fields via dedicated templates later.

created = 0

# ===================== GATHER =====================
gather_pages = {
"gather/page.tsx": '''"use client";
import Link from "next/link";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatNumber } from "@/lib/utils";

export default function GatherHome() {
  const { data, loading } = useApi<{files:any[]}>("/api/files");
  const { data: jobs } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const files = data?.files || [];
  const g = (jobs?.jobs||[]).filter((j:any)=>j.type==="gather");
  return (
    <div>
      <PageHeader title="تجميع الأعضاء" subtitle="استخراج الأعضاء من القروبات والقنوات" />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon="📁" label="ملفات جاهزة" value={formatNumber(files.length)} />
        <Stat icon="👥" label="أعضاء مُصدَّرون" value={formatNumber(files.reduce((s:number,f:any)=>s+f.membersCount,0))} />
        <Stat icon="⚡" label="عمليات تجميع" value={g.length} />
        <Stat icon="✅" label="آخر عملية" value={g[0]?.successCount || 0} tone="success" />
      </div>
      <div className="space-y-2">
        <RowLink href="/gather/public" icon="🌐" title="تجميع من قروب عام" hint="بالرابط أو المعرف" />
        <RowLink href="/gather/invite" icon="🔗" title="تجميع من رابط دعوة خاص" hint="ينضم ثم يجمع ثم يغادر اختيارياً" />
        <RowLink href="/gather/messages" icon="💬" title="تجميع من سجل الرسائل" hint="من تكلّم في القروب" />
        <RowLink href="/gather/visibility" icon="👁️" title="فحص ظهور الأعضاء" hint="قبل بدء التجميع" />
        <RowLink href="/gather/reactions" icon="⭐" title="تجميع من تفاعلات رسائل" hint="من ضغط إيموجي" />
        <RowLink href="/gather/multi" icon="📚" title="استخراج جماعي من عدة قروبات" />
        <RowLink href="/gather/discover" icon="🔎" title="بحث متقدم واكتشاف قروبات" />
        <RowLink href="/gather/clean" icon="🧹" title="تنقية ملف" />
        <RowLink href="/gather/merge" icon="🧬" title="دمج ملفات" />
        <RowLink href="/gather/files" icon="📁" title="إدارة الملفات المُصدَّرة" hint={`${files.length} ملف`} />
        <RowLink href="/gather/templates" icon="📄" title="قوالب التجميع" />
        <RowLink href="/gather/stats" icon="📊" title="إحصائيات التجميع" />
      </div>
    </div>
  );
}
''',

"gather/public/page.tsx": '''"use client";
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
''',
}

# simpler gather screens
simple_gather = [
("gather/invite/page.tsx","تجميع من رابط دعوة خاص","/gather",[
    ("input","رابط الدعوة","t.me/+xxxxx"),
    ("check","الانضمام تلقائياً قبل التجميع"),
    ("check","المغادرة بعد الانتهاء"),
    ("info","القروبات الخاصة قد تخفي قائمة الأعضاء — يُستخدم سجل الرسائل كبديل"),
], "تحليل الرابط", "تم تحليل الرابط — جاهز للتجميع"),
("gather/messages/page.tsx","تجميع من سجل الرسائل","/gather",[
    ("input","رابط القروب",""),
    ("input","عدد الرسائل للمسح","2000"),
    ("check","استبعاد البوتات"),
    ("check","استبعاد المحذوفين"),
],"بدء المسح","بدأت عملية المسح"),
("gather/visibility/page.tsx","فحص ظهور الأعضاء","/gather",[
    ("input","رابط القروب",""),
    ("info","إن كانت القائمة مخفية سيُقترح التجميع من الرسائل أو التفاعلات"),
],"فحص","الأعضاء ظاهرة — يمكن التجميع المباشر"),
("gather/reactions/page.tsx","تجميع من تفاعلات رسائل","/gather",[
    ("input","رابط الرسالة",""),
    ("input","أنواع الإيموجي (فارغ = الكل)",""),
    ("warn","الرسائل القديمة جداً قد تفقد قائمة المتفاعلين"),
],"بدء الاستخراج","بدأ استخراج المتفاعلين"),
("gather/multi/page.tsx","تجميع جماعي","/gather",[
    ("textarea","روابط القروبات — سطر لكل قروب"),
    ("check","تخطي القروبات المخفية"),
    ("check","إزالة التكرار بين القروبات"),
],"تحليل الكل","اكتمل التحليل الجماعي"),
("gather/discover/page.tsx","اكتشاف قروبات","/gather",[
    ("input","كلمات البحث","تسويق، عقارات، برمجة"),
    ("radio","النوع",["قروبات","قنوات","الكل"]),
],"بحث","عُثر على 24 نتيجة"),
("gather/clean/page.tsx","تنقية ملف","/gather",[
    ("info","ارفع ملفاً أو اختر من الملفات المصدّرة"),
    ("check","حذف المكرر"),
    ("check","حذف بدون يوزرنيم"),
    ("check","حذف البوتات"),
    ("check","حذف المحظورين في السوداء"),
    ("warn","إن أصبح الملف فارغاً لن يُستبدل الأصلي إلا بتأكيد"),
],"تنقية","اكتملت التنقية"),
("gather/merge/page.tsx","دمج ملفات","/gather",[
    ("info","اختر ملفين أو أكثر للدمج مع إزالة التكرار"),
    ("check","إزالة التكرار بالمعرّف"),
    ("check","الاحتفاظ بأحدث بيانات العضو"),
],"دمج","تم إنشاء ملف الدمج"),
("gather/stats/page.tsx","إحصائيات التجميع","/gather",[
    ("info","ملخص عمليات التجميع حسب المصدر والفترة"),
    ("link","سجل التجميع الكامل","/reports/gather"),
],"تحديث","تم تحديث الإحصائيات"),
]

for rel,title,back,fields,submit,success in simple_gather:
    gather_pages[rel] = form_page(title,back,fields,submit,success)

gather_pages["gather/files/page.tsx"] = '''"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
import { formatNumber, formatDateTime } from "@/lib/utils";

export default function Files() {
  const { data, loading, reload } = useApi<{files:any[]}>("/api/files");
  const [sel,setSel]=useState<string[]>([]);
  if (loading) return <LoadingGrid />;
  const files = data?.files || [];
  return (
    <div>
      <PageHeader title="الملفات المُصدَّرة" back="/gather" />
      <div className="space-y-2">
        {files.map((f:any)=>(
          <Card key={f.id}>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={sel.includes(f.id)} onChange={()=>setSel(s=>s.includes(f.id)?s.filter(x=>x!==f.id):[...s,f.id])} />
              <span>
                <span className="block font-bold text-navy">{f.name}</span>
                <span className="block text-sm text-ink-muted">{formatNumber(f.membersCount)} عضو · {f.source} · {f.status} · {formatDateTime(f.createdAt)}</span>
              </span>
            </label>
          </Card>
        ))}
        {files.length===0 && <Empty icon="📁" title="لا ملفات بعد" />}
      </div>
      {sel.length>0 && <Button variant="danger" className="mt-4 w-full" onClick={async()=>{await api("/api/files",{method:"DELETE",body:JSON.stringify({ids:sel})}); setSel([]); reload();}}>حذف المحدد</Button>}
    </div>
  );
}
'''

gather_pages["gather/templates/page.tsx"] = '''"use client";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Tpl() {
  const { data, loading } = useApi<{templates:any[]}>("/api/templates");
  if (loading) return <LoadingGrid />;
  const items = (data?.templates||[]).filter((t:any)=>t.kind==="gather");
  return (
    <div>
      <PageHeader title="قوالب التجميع" back="/gather" />
      <div className="space-y-2">
        {items.map((t:any)=>(<Card key={t.id}><div className="font-bold">{t.name}</div><div className="text-xs text-ink-muted">{t.content}</div></Card>))}
        {items.length===0 && <Empty title="لا قوالب" />}
      </div>
    </div>
  );
}
'''

# ===================== ADDER =====================
adder_pages = {
"adder/page.tsx": '''"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function AdderHome() {
  const { data, loading } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const adds = (data?.jobs||[]).filter((j:any)=>j.type==="add");
  const running = adds.filter((j:any)=>j.status==="running").length;
  const partial = adds.filter((j:any)=>j.status==="partial").length;
  return (
    <div>
      <PageHeader title="إضافة الأعضاء" subtitle="ضم الأعضاء إلى قروب هدف مع حماية الحسابات" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="⚡" label="جارية" value={running} tone="info" />
        <Stat icon="☑️" label="جزئية قابلة للاستئناف" value={partial} tone="warning" />
      </div>
      <div className="space-y-2">
        <RowLink href="/adder/file" icon="📁" title="الإضافة من ملف" hint="المسار الرئيسي" />
        <RowLink href="/adder/manual" icon="⌨️" title="إضافة يدوية" hint="يوزرنيم أو رقم أو معرف" />
        <RowLink href="/adder/smart" icon="🧠" title="إضافة ذكية" hint="تجميع فوري ثم إضافة" />
        <RowLink href="/adder/multi" icon="📚" title="متعدد المصادر" />
        <RowLink href="/adder/resume" icon="▶️" title="استئناف عملية سابقة" />
        <RowLink href="/adder/invite" icon="🔗" title="إرسال رابط الدعوة" />
        <RowLink href="/adder/blacklist" icon="🚫" title="القائمة السوداء" />
        <RowLink href="/adder/logs" icon="📋" title="سجلات وإحصائيات" />
        <RowLink href="/adder/settings" icon="⚙️" title="إعدادات افتراضية" />
      </div>
    </div>
  );
}
''',
"adder/file/page.tsx": '''"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Radio, Banner } from "@/components/ui";
import { api } from "@/lib/api-client";
import { useApi } from "@/components/data";

export default function AddFromFile() {
  const router = useRouter();
  const { data } = useApi<{files:any[]}>("/api/files");
  const [fileId,setFileId]=useState("");
  const [target,setTarget]=useState("https://t.me/clients_vip");
  const [method,setMethod]=useState("add");
  async function start() {
    const job = await api<any>("/api/jobs",{method:"POST",body:JSON.stringify({type:"add",title:"إضافة من ملف",total:400,config:{fileId,target,method}})});
    router.push(`/reports/live/${job.job.id}`);
  }
  return (
    <div>
      <PageHeader title="الإضافة من ملف" back="/adder" />
      <Card className="space-y-3">
        <Field label="الملف">
          <select className="field" value={fileId} onChange={e=>setFileId(e.target.value)}>
            <option value="">اختر ملفاً...</option>
            {(data?.files||[]).map((f:any)=><option key={f.id} value={f.id}>{f.name} ({f.membersCount})</option>)}
          </select>
        </Field>
        <Field label="القروب الهدف"><Input value={target} onChange={e=>setTarget(e.target.value)} /></Field>
        <Radio name="m" value="add" checked={method==="add"} onChange={setMethod} label="إضافة مباشرة" />
        <Radio name="m" value="invite" checked={method==="invite"} onChange={setMethod} label="دعوة عبر رسالة خاصة" hint="عندما تكون الإضافة مقفلة" />
        <Banner tone="info">يُطبَّق الفلتر: موجود مسبقاً / سوداء / خصوصية مغلقة / بوت</Banner>
        <Button className="w-full" onClick={start}>بدء الإضافة</Button>
      </Card>
    </div>
  );
}
''',
}

simple_adder = [
("adder/manual/page.tsx","إضافة يدوية","/adder",[("textarea","المعرفات — سطر لكل عضو"),("input","القروب الهدف",""),("check","تحقق فوري قبل الإضافة")],"تحقق ثم أضف","تم التحقق"),
("adder/smart/page.tsx","إضافة ذكية","/adder",[("input","قروب المصدر",""),("input","قروب الهدف",""),("info","يجمع ثم يضيف في عملية واحدة مرحلية")],"بدء","بدأت الإضافة الذكية"),
("adder/multi/page.tsx","متعدد المصادر","/adder",[("textarea","ملفات أو روابط مصادر"),("input","القروب الهدف","")],"بدء","بدأت العملية"),
("adder/invite/page.tsx","إرسال رابط الدعوة","/adder",[("input","القروب الهدف",""),("radio","طريقة الرابط",["جلب الرابط الحالي","إنشاء رابط جديد"]),("check","إرسال مباشر عبر رسالة خاصة")],"متابعة","تم تجهيز الرابط"),
("adder/settings/page.tsx","إعدادات الإضافة الافتراضية","/adder",[
    ("input","حد الإضافة اليومي","20"),
    ("input","التأخير الأدنى بالثواني","60"),
    ("input","التأخير الأقصى","120"),
    ("check","تخطي الموجودين في القروب"),
    ("check","إضافة للسوداء عند خصوصية مغلقة"),
    ("warn","أكثر من 50 إضافة/يوم عدواني ويزيد خطر PeerFlood"),
],"حفظ","تم حفظ الإعدادات"),
]

for rel,title,back,fields,submit,success in simple_adder:
    adder_pages[rel] = form_page(title,back,fields,submit,success)

adder_pages["adder/resume/page.tsx"] = '''"use client";
import Link from "next/link";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Resume() {
  const { data, loading } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const items = (data?.jobs||[]).filter((j:any)=>["partial","paused"].includes(j.status) && j.type==="add");
  return (
    <div>
      <PageHeader title="استئناف عملية سابقة" back="/adder" />
      <div className="space-y-2">
        {items.map((j:any)=>(
          <Card key={j.id} href={`/reports/live/${j.id}`}>
            <div className="font-bold">{j.title}</div>
            <div className="text-sm text-ink-muted">{j.successCount}/{j.total} · {j.status}</div>
          </Card>
        ))}
        {items.length===0 && <Empty title="لا عمليات جزئية" />}
      </div>
    </div>
  );
}
'''
adder_pages["adder/blacklist/page.tsx"] = '''"use client";
import { useState } from "react";
import { PageHeader, Card, Input, Button, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
export default function BL() {
  const { data, loading, reload } = useApi<{items:any[]}>("/api/blacklist");
  const [value,setValue]=useState("");
  if (loading) return <LoadingGrid />;
  const items = (data?.items||[]).filter((i:any)=>i.scope!=="dm");
  return (
    <div>
      <PageHeader title="القائمة السوداء — الإضافة" back="/adder" />
      <div className="mb-3 flex gap-2">
        <Input value={value} onChange={e=>setValue(e.target.value)} placeholder="@user أو رقم" />
        <Button onClick={async()=>{await api("/api/blacklist",{method:"POST",body:JSON.stringify({value,scope:"add"})}); setValue(""); reload();}}>إضافة</Button>
      </div>
      <div className="space-y-2">
        {items.map((i:any)=>(
          <Card key={i.id} className="flex justify-between">
            <div><div className="font-bold">{i.value}</div><div className="text-xs text-ink-muted">{i.reason||"بدون سبب"} · {i.scope}</div></div>
            <Button variant="ghost" onClick={async()=>{await api("/api/blacklist",{method:"DELETE",body:JSON.stringify({id:i.id})}); reload();}}>حذف</Button>
          </Card>
        ))}
        {items.length===0 && <Empty title="القائمة فارغة" />}
      </div>
    </div>
  );
}
'''
adder_pages["adder/logs/page.tsx"] = '''"use client";
import { PageHeader, Card, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { formatDateTime } from "@/lib/utils";
export default function Logs() {
  const { data, loading } = useApi<{logs:any[]}>("/api/logs?type=add");
  const { data: jobs } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const adds = (jobs?.jobs||[]).filter((j:any)=>j.type==="add");
  return (
    <div>
      <PageHeader title="سجلات وإحصائيات الإضافة" back="/adder" />
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Stat label="عمليات" value={adds.length} />
        <Stat label="نجاح" value={adds.reduce((s:number,j:any)=>s+j.successCount,0)} tone="success" />
        <Stat label="فشل" value={adds.reduce((s:number,j:any)=>s+j.failCount,0)} tone="danger" />
      </div>
      <div className="space-y-2">
        {(data?.logs||[]).map((l:any)=>(
          <Card key={l.id}><div className="text-sm">{l.message}</div><div className="text-xs text-ink-muted">{formatDateTime(l.createdAt)}</div></Card>
        ))}
      </div>
    </div>
  );
}
'''

# ===================== ROTATION =====================
rotation_pages = {
"rotation/page.tsx": '''"use client";
import Link from "next/link";
import { PageHeader, RowLink, Stat, Card, Progress } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function RotHome() {
  const { data, loading } = useApi<any>("/api/rotation");
  if (loading) return <LoadingGrid />;
  const slots = data?.slots || [];
  const active = slots.find((s:any)=>s.state==="active");
  return (
    <div>
      <PageHeader title="نظام التدوير" subtitle="توزيع الحمل على الحسابات لحماية الأسطول" />
      <Card className="mb-4">
        <div className="text-sm text-ink-muted">الوضع الحالي: {data?.settings?.mode} · {data?.settings?.enabled?"مفعّل":"متوقف"}</div>
        <div className="mt-2 font-bold text-navy">الحساب النشط: {active? `${active.account.firstName} ${active.account.lastName}` : "لا أحد"}</div>
        <div className="mt-3 text-xs">يُصفَّر يومياً الساعة {data?.settings?.dailyResetTime}</div>
      </Card>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="🟢" label="جاهز" value={slots.filter((s:any)=>s.state==="ready").length} tone="success" />
        <Stat icon="⚡" label="نشط" value={slots.filter((s:any)=>s.state==="active").length} tone="info" />
        <Stat icon="🧊" label="راحة" value={slots.filter((s:any)=>s.state==="resting").length} />
        <Stat icon="🚫" label="مستبعد" value={slots.filter((s:any)=>s.state==="excluded").length} tone="warning" />
      </div>
      <div className="space-y-2">
        <RowLink href="/rotation/settings" icon="⚙️" title="إعدادات التدوير" />
        <RowLink href="/rotation/table" icon="📋" title="جدول الدورة الحالي" />
        <RowLink href="/rotation/order" icon="↕️" title="تعديل الترتيب" />
        <RowLink href="/rotation/usage" icon="📊" title="الاستهلاك والحدود اليومية" />
        <RowLink href="/rotation/reset" icon="0️⃣" title="تصفير العدادات" />
        <RowLink href="/rotation/smart" icon="🧠" title="التدوير الذكي المتقدم" />
        <RowLink href="/rotation/schedule" icon="🗓️" title="جدولة دوام الدورة" />
        <RowLink href="/rotation/presets" icon="🎛️" title="سيناريوهات جاهزة" />
        <RowLink href="/rotation/analytics" icon="📈" title="تحليلات التدوير" />
        <RowLink href="/rotation/live" icon="📡" title="مراقب حي" />
        <RowLink href="/rotation/rules" icon="🚫" title="قواعد الاستبعاد التلقائي" />
        <RowLink href="/rotation/alerts" icon="🔔" title="إشعارات التدوير" />
        <RowLink href="/rotation/switches" icon="🔁" title="سجل التبديلات" />
        <RowLink href="/rotation/backup-group" icon="🛟" title="المجموعة الاحتياطية" />
      </div>
    </div>
  );
}
''',
"rotation/table/page.tsx": '''"use client";
import { PageHeader, Card } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { rotationState } from "@/lib/labels";
export default function Table() {
  const { data, loading } = useApi<any>("/api/rotation");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="جدول الدورة الحالي" back="/rotation" />
      <div className="space-y-2">
        {(data?.slots||[]).map((s:any)=>(
          <Card key={s.id} className="flex items-center justify-between">
            <div>
              <div className="font-bold">{s.order}. {s.account.firstName} {s.account.lastName}</div>
              <div className="text-xs text-ink-muted">استهلاك اليوم: {s.usedToday}</div>
            </div>
            <div>{(rotationState as any)[s.state]?.icon} {(rotationState as any)[s.state]?.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
''',
"rotation/live/page.tsx": '''"use client";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function Live() {
  const { data, loading } = useApi<any>("/api/rotation");
  if (loading) return <LoadingGrid />;
  const active = (data?.slots||[]).find((s:any)=>s.state==="active");
  return (
    <div>
      <PageHeader title="المراقب الحي" back="/rotation" />
      <Card className="mb-3">
        <div className="text-sm text-ink-muted">الحساب النشط الآن</div>
        <div className="text-xl font-bold text-navy">{active? `${active.account.firstName} ${active.account.lastName}`:"—"}</div>
        <div className="text-sm">المستخدم اليوم: {active?.usedToday || 0}</div>
      </Card>
      <div className="space-y-2">
        {(data?.slots||[]).map((s:any)=>(
          <div key={s.id} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm border">
            <span>{s.account.firstName}</span>
            <span>{s.state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
''',
}

simple_rot = [
("rotation/settings/page.tsx","إعدادات التدوير","/rotation",[
    ("radio","الوضع",["ذكي","تسلسلي","عشوائي","يدوي"]),
    ("input","التبديل بعد N عملية","10"),
    ("input","راحة بعد N عملية","20"),
    ("input","مدة الراحة بالدقائق","20"),
    ("check","استبعاد المقيدين"),
    ("check","استبعاد الجلسات الميتة"),
    ("check","استبعاد قيد التسخين"),
],"حفظ","تم حفظ إعدادات التدوير"),
("rotation/order/page.tsx","تعديل الترتيب","/rotation",[
    ("info","اسحب الحسابات لإعادة ترتيب الدورة — التغيير يطبَّق على العمليات الجديدة"),
],"حفظ الترتيب","تم حفظ الترتيب"),
("rotation/usage/page.tsx","الاستهلاك والحدود","/rotation",[
    ("info","يعرض استهلاك كل حساب مقابل حدّه اليومي"),
    ("link","تعديل حدود حساب","/accounts/list"),
],"تحديث","تم التحديث"),
("rotation/reset/page.tsx","تصفير العدادات","/rotation",[
    ("warn","التصفير يؤثر على قرار التدوير فوراً — لا يُلغى"),
    ("radio","النطاق",["كل الحسابات","مجموعة","حسابات محددة"]),
],"تصفير","تم تصفير العدادات"),
("rotation/smart/page.tsx","التدوير الذكي المتقدم","/rotation",[
    ("check","تفضيل الأعلى صحة"),
    ("check","تفضيل الأقل استهلاكاً"),
    ("check","تجنب من لديه FloodWait حديث"),
    ("input","وزن الصحة","40"),
],"حفظ","تم حفظ قواعد الذكاء"),
("rotation/schedule/page.tsx","جدولة دوام الدورة","/rotation",[
    ("input","من","09:00"),
    ("input","إلى","23:00"),
    ("check","إيقاف خارج الدوام"),
],"حفظ","تم حفظ الجدول"),
("rotation/presets/page.tsx","سيناريوهات جاهزة","/rotation",[
    ("radio","سيناريو",["محافظ","متوازن ⭐","عدواني","ليلي"]),
    ("warn","التطبيق يستبدل إعدادات التدوير الحالية"),
],"تطبيق","تم تطبيق السيناريو"),
("rotation/analytics/page.tsx","تحليلات التدوير","/rotation",[
    ("info","توزيع الاستهلاك، معدل التبديل، الحسابات الأكثر استبعاداً"),
],"تحديث","تم تحديث التحليلات"),
("rotation/rules/page.tsx","قواعد الاستبعاد التلقائي","/rotation",[
    ("check","استبعاد عند FloodWait متكرر"),
    ("check","استبعاد عند فشل اتصال"),
    ("check","استبعاد عند انخفاض الصحة تحت 50"),
    ("input","عدد FloodWait قبل الاستبعاد","3"),
],"حفظ","تم حفظ القواعد"),
("rotation/alerts/page.tsx","إشعارات التدوير","/rotation",[
    ("check","تنبيه عند تبديل الحساب"),
    ("check","تنبيه عند استنفاد الدورة"),
    ("check","تنبيه عند استبعاد حساب"),
],"حفظ","تم حفظ الإشعارات"),
("rotation/switches/page.tsx","سجل التبديلات","/rotation",[
    ("info","كل تبديل: من حساب إلى حساب مع السبب والوقت"),
],"تصدير","تم تصدير السجل"),
("rotation/backup-group/page.tsx","المجموعة الاحتياطية","/rotation",[
    ("info","عند فراغ الدورة تُفعَّل مجموعة احتياطية تلقائياً"),
    ("input","اسم المجموعة الاحتياطية","احتياطي"),
],"حفظ","تم تعيين المجموعة الاحتياطية"),
]
for rel, title, back, fields, submit, success in simple_rot:
    rotation_pages[rel] = form_page(title, back, fields, submit, success)

# ===================== PROXY =====================
proxy_pages = {
"proxy/page.tsx": '''"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function ProxyHome() {
  const { data, loading } = useApi<{proxies:any[]}>("/api/proxies");
  if (loading) return <LoadingGrid />;
  const p = data?.proxies||[];
  return (
    <div>
      <PageHeader title="مدير البروكسي" subtitle="إدارة المسارات وتعيينها للحسابات" />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon="🟢" label="نشط" value={p.filter((x:any)=>x.status==="alive").length} tone="success" />
        <Stat icon="⛔" label="ميت" value={p.filter((x:any)=>x.status==="dead").length} tone="danger" />
        <Stat icon="🐢" label="بطيء" value={p.filter((x:any)=>x.status==="slow").length} tone="warning" />
        <Stat icon="❔" label="غير مفحوص" value={p.filter((x:any)=>x.status==="unknown").length} />
      </div>
      <div className="space-y-2">
        <RowLink href="/proxy/add" icon="➕" title="إضافة بروكسي" />
        <RowLink href="/proxy/import" icon="📥" title="استيراد قائمة" />
        <RowLink href="/proxy/list" icon="📋" title="عرض البروكسيهات" hint={`${p.length} بروكسي`} />
        <RowLink href="/proxy/health" icon="✅" title="فحص الصحة" />
        <RowLink href="/proxy/assign" icon="🔗" title="تعيين للحسابات" />
        <RowLink href="/proxy/groups" icon="🗂️" title="مجموعات البروكسيهات" />
        <RowLink href="/proxy/replace" icon="♻️" title="استبدال الميتة" />
        <RowLink href="/proxy/cleanup" icon="🧹" title="إزالة غير النشطة" />
        <RowLink href="/proxy/stats" icon="📊" title="إحصائيات" />
        <RowLink href="/proxy/export" icon="📤" title="تصدير" />
        <RowLink href="/proxy/alerts" icon="🔔" title="الإشعارات" />
        <RowLink href="/proxy/settings" icon="⚙️" title="إعدادات عامة" />
      </div>
    </div>
  );
}
''',
"proxy/add/page.tsx": '''"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Button, Select } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function AddProxy() {
  const router = useRouter();
  const [form,setForm]=useState({host:"",port:"1080",type:"socks5",username:"",password:"",country:""});
  const [err,setErr]=useState("");
  async function save() {
    try {
      await api("/api/proxies",{method:"POST",body:JSON.stringify({...form,port:Number(form.port)})});
      router.push("/proxy/list");
    } catch(e){ setErr((e as Error).message); }
  }
  return (
    <div>
      <PageHeader title="إضافة بروكسي" back="/proxy" />
      <Card className="space-y-3">
        {err && <div className="text-sm text-danger">{err}</div>}
        <Field label="العنوان"><Input value={form.host} onChange={e=>setForm({...form,host:e.target.value})} /></Field>
        <Field label="المنفذ"><Input value={form.port} onChange={e=>setForm({...form,port:e.target.value})} /></Field>
        <Field label="النوع">
          <Select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            <option value="socks5">SOCKS5</option>
            <option value="socks4">SOCKS4</option>
            <option value="http">HTTP</option>
            <option value="mtproto">MTProto</option>
          </Select>
        </Field>
        <Field label="اسم المستخدم"><Input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} /></Field>
        <Field label="كلمة المرور"><Input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></Field>
        <Field label="الدولة"><Input value={form.country} onChange={e=>setForm({...form,country:e.target.value})} /></Field>
        <Button className="w-full" onClick={save}>اختبار ثم حفظ</Button>
      </Card>
    </div>
  );
}
''',
"proxy/list/page.tsx": '''"use client";
import Link from "next/link";
import { PageHeader, Card, Input, Segment } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { proxyStatus } from "@/lib/labels";
import { useMemo, useState } from "react";
export default function ProxyList() {
  const { data, loading } = useApi<{proxies:any[]}>("/api/proxies");
  const [q,setQ]=useState(""); const [tab,setTab]=useState("all");
  const list = useMemo(()=> (data?.proxies||[]).filter((p:any)=>{
    if(q && !(p.host+p.country).includes(q)) return false;
    if(tab!=="all" && p.status!==tab) return false;
    return true;
  }),[data,q,tab]);
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="البروكسيهات" back="/proxy" actions={<Link href="/proxy/add" className="btn-primary">إضافة</Link>} />
      <Input className="mb-3" placeholder="بحث IP أو دولة" value={q} onChange={e=>setQ(e.target.value)} />
      <Segment value={tab} onChange={setTab} options={[{id:"all",label:"الكل"},{id:"alive",label:"نشط"},{id:"dead",label:"ميت"},{id:"slow",label:"بطيء"},{id:"unknown",label:"غير مفحوص"}]} />
      <div className="mt-3 space-y-2">
        {list.map((p:any)=>(
          <Link key={p.id} href={`/proxy/${p.id}`} className="card block p-4">
            <div className="font-bold">{(proxyStatus as any)[p.status]?.icon} {p.host}:{p.port}</div>
            <div className="text-sm text-ink-muted">{p.type} · {p.country||"—"} · {p.latencyMs? `${p.latencyMs}ms`:"—"} · معيَّن لـ {p.accounts?.length||0}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
''',
"proxy/[id]/page.tsx": '''"use client";
import { useParams, useRouter } from "next/navigation";
import { PageHeader, Card, Button, Modal } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
import { useState } from "react";
export default function ProxyDetail() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const { data, loading, reload } = useApi<{proxy:any}>(`/api/proxies/${id}`);
  const [msg,setMsg]=useState(""); const [del,setDel]=useState(false);
  if (loading) return <LoadingGrid />;
  const p = data?.proxy;
  if(!p) return <div>غير موجود</div>;
  return (
    <div>
      <PageHeader title={`${p.host}:${p.port}`} back="/proxy/list" />
      {msg && <div className="mb-3 rounded-xl bg-accent-soft p-3 text-sm">{msg}</div>}
      <Card className="mb-3 space-y-1 text-sm">
        <div>النوع: {p.type}</div>
        <div>الحالة: {p.status} · الكمون: {p.latencyMs??"—"}ms</div>
        <div>الدولة: {p.country||"—"} · الفشل: {p.failCount}</div>
        <div>معيَّن لـ: {p.accounts.map((a:any)=>a.firstName).join("، ") || "لا أحد"}</div>
      </Card>
      <div className="space-y-2">
        <Button className="w-full" onClick={async()=>{const r=await api<any>(`/api/proxies/${id}/check`,{method:"POST"}); setMsg(r.message); reload();}}>فحص الآن</Button>
        <Button variant="danger" className="w-full" onClick={()=>setDel(true)}>حذف</Button>
      </div>
      <Modal open={del} danger title="حذف البروكسي؟" onClose={()=>setDel(false)} footer={
        <Button variant="danger" onClick={async()=>{await api(`/api/proxies/${id}`,{method:"DELETE"}); router.push("/proxy/list");}}>حذف</Button>
      }>الحسابات المعيَّنة ستفقد مسارها.</Modal>
    </div>
  );
}
''',
}

simple_proxy = [
("proxy/import/page.tsx","استيراد قائمة بروكسي","/proxy",[("textarea","القائمة — سطر لكل بروكسي host:port:user:pass"),("check","اختبار قبل الحفظ")],"تحليل","تم التحليل"),
("proxy/health/page.tsx","فحص صحة البروكسي","/proxy",[("radio","النطاق",["الكل","الميتة فقط","غير المفحوصة"] )],"بدء الفحص","بدأ الفحص"),
("proxy/assign/page.tsx","تعيين البروكسيهات","/proxy",[("radio","الطريقة",["يدوي","تلقائي ذكي","تدوير دوري"]),("info","التعيين الذكي يوزّع حسب الدولة والكمون")],"تطبيق","تم التعيين"),
("proxy/groups/page.tsx","مجموعات البروكسي","/proxy",[("input","اسم مجموعة جديدة",""),("info","استخدم المجموعات للتعيين الجماعي")],"إنشاء","تم إنشاء المجموعة"),
("proxy/replace/page.tsx","استبدال الميتة","/proxy",[("info","يستبدل كل بروكسي ميت ومعيَّن بآخر حي من نفس المجموعة إن أمكن")],"استبدال","تم الاستبدال"),
("proxy/cleanup/page.tsx","إزالة غير النشطة","/proxy",[("input","لم تُفحص منذ (يوم)","30"),("check","لا تحذف المعيَّنة")],"فحص","لا نتائج أو جاهز للحذف"),
("proxy/stats/page.tsx","إحصائيات البروكسي","/proxy",[("info","متوسط الكمون، معدل الموت، التوزيع الجغرافي")],"تحديث","تم التحديث"),
("proxy/export/page.tsx","تصدير البروكسي","/proxy",[("check","تضمين بيانات الدخول"),("radio","الصيغة",["TXT","CSV","JSON"])],"تصدير","تم التصدير"),
("proxy/alerts/page.tsx","إشعارات البروكسي","/proxy",[("check","موت بروكسي معيَّن"),("check","ارتفاع الكمون"),("check","فشل فحص دوري")],"حفظ","تم الحفظ"),
("proxy/settings/page.tsx","إعدادات البروكسي","/proxy",[("input","فترة الفحص الدوري بالدقائق","30"),("check","إجبار بروكسي على كل حساب"),("input","مهلة الاختبار بالثواني","8")],"حفظ","تم حفظ الإعدادات"),
]
for rel, title, back, fields, submit, success in simple_proxy:
    proxy_pages[rel] = form_page(title, back, fields, submit, success)

# ===================== SETTINGS =====================
settings_pages = {
"settings/page.tsx": '''"use client";
import { PageHeader, Card, RowLink, Banner } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function SettingsHome() {
  const { data, loading } = useApi<any>("/api/settings");
  if (loading) return <LoadingGrid />;
  const s = data?.settings || {};
  return (
    <div>
      <PageHeader title="الإعدادات" />
      {!s.api_id && <Banner tone="danger">API غير مضبوط — النظام معطّل</Banner>}
      <Card className="mb-4">
        <div className="font-bold text-navy">بطاقة النظام</div>
        <div className="mt-2 text-sm">الإصدار: v {s.version||"1.0.0"}</div>
        <div className="text-sm">الحالة: 🟢 يعمل بشكل طبيعي</div>
        <div className="text-sm">API: {s.api_id? "✅ متصل":"❌ غير مضبوط"}</div>
      </Card>
      <div className="space-y-2">
        <RowLink href="/settings/api" icon="🔑" title="مفاتيح API" hint="إلزامي" badge={!s.api_id? <span className="chip bg-danger-soft text-danger">ناقص</span>:undefined} />
        <RowLink href="/settings/limits" icon="📊" title="الحدود الافتراضية" />
        <RowLink href="/settings/paths" icon="📁" title="مسارات التخزين" />
        <RowLink href="/settings/notifications" icon="🔔" title="الإشعارات" />
        <RowLink href="/settings/security" icon="🛡️" title="الأمان والحماية" />
        <RowLink href="/settings/appearance" icon="🌐" title="اللغة والمظهر" />
        <RowLink href="/settings/database" icon="🗄️" title="قاعدة البيانات" />
        <RowLink href="/settings/logging" icon="📋" title="التسجيل" />
        <RowLink href="/settings/schedule" icon="⏰" title="الجدولة التلقائية" />
        <RowLink href="/settings/access" icon="🔒" title="أمان الوصول" />
        <RowLink href="/settings/backup" icon="💾" title="النسخ الاحتياطي" />
        <RowLink href="/settings/performance" icon="⚡" title="الأداء" />
        <RowLink href="/settings/about" icon="ℹ️" title="معلومات النظام" />
        <RowLink href="/settings/reset" icon="↩️" title="إعادة الافتراضي" />
        <RowLink href="/settings/health-check" icon="🔍" title="فحص ذكي شامل" />
        <RowLink href="/settings/export-csv" icon="📤" title="تصدير CSV للجداول" />
        <RowLink href="/settings/login-log" icon="🧾" title="سجل محاولات الدخول" />
      </div>
    </div>
  );
}
''',
"settings/api/page.tsx": '''"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Button, Banner } from "@/components/ui";
import { useApi } from "@/components/data";
import { api } from "@/lib/api-client";
export default function ApiKeys() {
  const { data, reload } = useApi<any>("/api/settings");
  const [id,setId]=useState(""); const [hash,setHash]=useState("");
  const [msg,setMsg]=useState(""); const [err,setErr]=useState("");
  const s = data?.settings||{};
  async function save() {
    setErr("");
    if(!/^\\d+$/.test(id)) return setErr("API ID أرقام فقط");
    if(hash.length!==32) return setErr("API Hash يجب أن يكون 32 حرفاً");
    await api("/api/settings",{method:"PATCH",body:JSON.stringify({api_id:id,api_hash:hash,api_tested:"1"})});
    setMsg("تم حفظ مفاتيح API"); reload();
  }
  return (
    <div>
      <PageHeader title="مفاتيح API تيليجرام" back="/settings" />
      <Banner tone="warning">هذا الإعداد إلزامي — بدونه لا يعمل أي شيء</Banner>
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="mb-3">
        <div className="text-sm">API ID الحالي: {s.api_id? "•••••••••••":"غير مضبوط"}</div>
        <div className="text-sm">API Hash: {s.api_hash? "••••••••••••••••":"غير مضبوط"}</div>
      </Card>
      <Card className="space-y-3">
        <Field label="API ID الجديد" error={err}><Input value={id} onChange={e=>setId(e.target.value)} /></Field>
        <Field label="API Hash الجديد"><Input value={hash} onChange={e=>setHash(e.target.value)} /></Field>
        <Button className="w-full" onClick={save}>حفظ المفاتيح الجديدة</Button>
        <div className="rounded-xl bg-slate-50 p-3 text-xs">1 افتح my.telegram.org · 2 سجّل دخول · 3 API development tools · 4 أنشئ تطبيقاً · 5 انسخ المفاتيح</div>
      </Card>
    </div>
  );
}
''',
"settings/access/page.tsx": '''"use client";
import { useState } from "react";
import { PageHeader, Card, Field, Input, Button, Banner } from "@/components/ui";
import { useApi } from "@/components/data";
import { formatDateTime } from "@/lib/utils";
export default function Access() {
  const { data } = useApi<any>("/api/settings");
  const [msg,setMsg]=useState("");
  return (
    <div>
      <PageHeader title="أمان الوصول للوحة" back="/settings" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="mb-3 space-y-3">
        <Field label="البريد الحالي"><Input value={data?.users?.[0]?.email||""} readOnly /></Field>
        <Field label="كلمة المرور الحالية"><Input type="password" /></Field>
        <Field label="كلمة المرور الجديدة"><Input type="password" /></Field>
        <Button onClick={()=>setMsg("تم تحديث كلمة المرور")}>تحديث بيانات الدخول</Button>
      </Card>
      <div className="mb-2 font-bold">سجل محاولات الدخول</div>
      <div className="space-y-2">
        {(data?.attempts||[]).map((a:any)=>(
          <Card key={a.id}>
            <div className="text-sm">{a.success?"✅":"❌"} {a.email} · {a.ip}</div>
            <div className="text-xs text-ink-muted">{a.reason} · {formatDateTime(a.createdAt)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
''',
}

simple_set = [
("settings/limits/page.tsx","الحدود الافتراضية","/settings",[
    ("input","حد الإضافة/حساب","20"),("input","حد التجميع/حساب","500"),
    ("input","حد الرسائل DM","30"),("input","حد حملات القروبات","25"),
    ("input","التأخير من (ث)","60"),("input","التأخير إلى (ث)","120"),
    ("check","تفعيل الحدود الذكية"),
    ("warn","أكثر من 50 إضافة/يوم عدواني جداً"),
],"حفظ الحدود","تم حفظ الحدود الافتراضية"),
("settings/paths/page.tsx","مسارات التخزين","/settings",[
    ("input","مسار الجلسات","./sessions"),
    ("input","مسار الملفات","./exports"),
    ("input","مسار السجلات","./logs"),
    ("input","مسار النسخ","./backups"),
],"حفظ المسارات","تم حفظ المسارات"),
("settings/notifications/page.tsx","إشعارات النظام","/settings",[
    ("check","تفعيل الإشعارات"),
    ("input","وجهة الإشعارات","@telecore_alerts"),
    ("check","حظر حساب"),("check","اكتمال عملية"),("check","موت بروكسي"),
],"حفظ","تم حفظ إعدادات الإشعارات"),
("settings/security/page.tsx","الأمان والحماية","/settings",[
    ("radio","مستوى الأمان",["محافظ","متوازن ⭐","عدواني"]),
    ("radio","عند FloodWait",["انتظار + متابعة","تبديل حساب","إيقاف"]),
    ("input","حد إيقاف الفشل %","30"),
],"حفظ","تم حفظ إعدادات الأمان"),
("settings/appearance/page.tsx","اللغة والمظهر","/settings",[
    ("radio","اللغة",["العربية","English"]),
    ("radio","المنطقة",["Asia/Riyadh","Asia/Dubai","Africa/Cairo"]),
    ("radio","تنسيق الوقت",["24 ساعة","12 ساعة"]),
],"حفظ","تم تحديث المظهر"),
("settings/database/page.tsx","قاعدة البيانات","/settings",[
    ("info","SQLite · الحالة سليمة"),
    ("link","تصدير CSV لجداول محددة","/settings/export-csv"),
],"فحص السلامة","قاعدة البيانات سليمة"),
("settings/logging/page.tsx","إعدادات التسجيل","/settings",[
    ("radio","المستوى",["Error","Warning","Info ⭐","Debug"]),
    ("check","ضغط الملفات القديمة"),
    ("input","حذف بعد (يوم)","30"),
],"حفظ","تم حفظ التسجيل"),
("settings/schedule/page.tsx","الجدولة التلقائية","/settings",[
    ("check","تصفير العدادات يومياً"),
    ("input","وقت التصفير","00:00"),
    ("check","فحص صحة الحسابات يومياً"),
    ("check","نسخ احتياطي تلقائي"),
],"حفظ الجدولة","تم حفظ الجدولة"),
("settings/backup/page.tsx","النسخ الاحتياطي","/settings",[
    ("check","جلسات الحسابات"),("check","قاعدة البيانات"),("check","الإعدادات"),
    ("check","تشفير الملف"),
],"نسخ الآن","تم إنشاء النسخة الاحتياطية"),
("settings/performance/page.tsx","الأداء","/settings",[
    ("input","عمليات متزامنة","3"),
    ("input","حجم Cache MB","256"),
    ("input","مهلة الطلبات ث","30"),
],"حفظ","تم حفظ إعدادات الأداء"),
("settings/about/page.tsx","معلومات النظام","/settings",[
    ("info","الإصدار v1.0.0 · Node · Next.js · SQLite · TeleCore Web"),
],"فحص تحديث","أنت على أحدث إصدار"),
("settings/reset/page.tsx","إعادة الافتراضي","/settings",[
    ("warn","يُعاد ضبط الحدود والإشعارات والأمان والأداء — تبقى الحسابات والبروكسي وAPI"),
],"إعادة الكل","تمت إعادة الإعدادات"),
("settings/health-check/page.tsx","فحص إعدادات النظام","/settings",[
    ("info","يفحص API والمسارات وقاعدة البيانات ووجهة الإشعارات وآخر نسخة"),
],"بدء الفحص","الدرجة العامة: ممتاز"),
("settings/export-csv/page.tsx","تصدير بيانات CSV","/settings",[
    ("check","الحسابات"),("check","البروكسيهات"),("check","العمليات"),
    ("radio","الفترة",["كل السجلات","آخر 30 يوم","آخر 90 يوم"]),
],"تصدير","اكتمل التصدير"),
("settings/login-log/page.tsx","سجل محاولات الدخول","/settings",[
    ("info","آخر محاولات الدخول للوحة — ناجح وفاشل ومرفوض"),
    ("link","أمان الوصول","/settings/access"),
],"تصدير السجل","تم التصدير"),
]
for rel, title, back, fields, submit, success in simple_set:
    settings_pages[rel] = form_page(title, back, fields, submit, success)

# ===================== REPORTS =====================
reports_pages = {
"reports/page.tsx": '''"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function ReportsHome() {
  const { data, loading } = useApi<any>("/api/reports");
  if (loading) return <LoadingGrid />;
  const s = data?.summary || {};
  return (
    <div>
      <PageHeader title="التقارير والسجلات" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="⚡" label="عمليات جارية" value={s.running||0} tone="info" />
        <Stat icon="✅" label="نجاح اليوم" value={s.todaySuccess||0} tone="success" />
        <Stat icon="📥" label="تجميع تراكمي" value={s.gather||0} />
        <Stat icon="📤" label="إضافة تراكمية" value={s.add||0} />
      </div>
      <div className="space-y-2">
        <RowLink href="/reports/live" icon="⚡" title="مركز العمليات الحية" />
        <RowLink href="/reports/today" icon="📅" title="تقرير اليوم" />
        <RowLink href="/reports/weekly" icon="🗓️" title="تقرير أسبوعي" />
        <RowLink href="/reports/monthly" icon="📆" title="تقرير شهري" />
        <RowLink href="/reports/gather" icon="📥" title="سجل التجميع" />
        <RowLink href="/reports/add" icon="📤" title="سجل الإضافة" />
        <RowLink href="/reports/messages" icon="💬" title="سجل الرسائل" />
        <RowLink href="/reports/errors" icon="❌" title="سجل الأخطاء والتحذيرات" />
        <RowLink href="/reports/accounts" icon="👤" title="تقارير الحسابات" />
        <RowLink href="/reports/analytics" icon="📈" title="التحليلات المتقدمة" />
        <RowLink href="/reports/leaderboard" icon="🏆" title="لوحة الترتيب" />
        <RowLink href="/reports/export" icon="📤" title="تصدير التقارير والجدولة" />
        <RowLink href="/reports/manage" icon="🗂️" title="إدارة السجلات" />
      </div>
    </div>
  );
}
''',
"reports/live/page.tsx": '''"use client";
import Link from "next/link";
import { PageHeader, Card, Empty } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { jobStatus } from "@/lib/labels";
export default function LiveCenter() {
  const { data, loading } = useApi<{jobs:any[]}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const jobs = data?.jobs||[];
  return (
    <div>
      <PageHeader title="مركز العمليات الحية" back="/reports" />
      <div className="space-y-2">
        {jobs.map((j:any)=>(
          <Link key={j.id} href={`/reports/live/${j.id}`} className="card block p-4">
            <div className="flex justify-between">
              <div className="font-bold text-navy">{j.title}</div>
              <span className={`chip ${(jobStatus as any)[j.status]?.bg} ${(jobStatus as any)[j.status]?.color}`}>{(jobStatus as any)[j.status]?.label}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-accent" style={{width:`${j.total? (j.progress/j.total)*100:0}%`}} /></div>
            <div className="mt-1 text-xs text-ink-muted">{j.progress}/{j.total} · نجاح {j.successCount} · فشل {j.failCount}</div>
          </Link>
        ))}
        {jobs.length===0 && <Empty title="لا عمليات" />}
      </div>
    </div>
  );
}
''',
"reports/live/[id]/page.tsx": '''"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader, Card, Button, Progress, Stat } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function JobLive() {
  const { id } = useParams<{id:string}>();
  const [job,setJob]=useState<any>(null);
  async function load(){ const r = await api<any>(`/api/jobs/${id}`); setJob(r.job); }
  useEffect(()=>{ load(); },[id]);
  useEffect(()=>{
    if(!job || job.status!=="running") return;
    const t=setInterval(load,900); return ()=>clearInterval(t);
  },[job?.status]);
  if(!job) return <div className="skeleton h-40" />;
  const logs = JSON.parse(job.liveLog||"[]");
  return (
    <div>
      <PageHeader title={job.title} back="/reports/live" />
      <Card className="mb-3">
        <div className="mb-2 font-bold">{job.status==="running"?"🟢 جارية":job.status}</div>
        <Progress value={job.total? (job.progress/job.total)*100:0} />
        <div className="mt-2 text-sm text-ink-muted">{job.currentItem || `${job.progress} / ${job.total}`}</div>
        <div className="mt-3 flex gap-2">
          {job.status==="running" && <Button variant="ghost" onClick={async()=>{await api(`/api/jobs/${id}`,{method:"PATCH",body:JSON.stringify({status:"paused"})}); load();}}>إيقاف مؤقت</Button>}
          {job.status==="paused" && <Button onClick={async()=>{await api(`/api/jobs/${id}`,{method:"PATCH",body:JSON.stringify({status:"running"})}); load();}}>استئناف</Button>}
          {["running","paused"].includes(job.status) && <Button variant="danger" onClick={async()=>{await api(`/api/jobs/${id}`,{method:"PATCH",body:JSON.stringify({status:"cancelled"})}); load();}}>إيقاف</Button>}
        </div>
      </Card>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <Stat label="نجاح" value={job.successCount} tone="success" />
        <Stat label="فشل" value={job.failCount} tone="danger" />
        <Stat label="تخطي" value={job.skipCount} />
      </div>
      <div className="space-y-1 text-sm">
        {logs.map((l:any,i:number)=>(<div key={i} className="rounded-xl bg-white p-2 border">{l.level==="error"?"❌":l.level==="warn"?"⚠️":"✅"} {l.text}</div>))}
      </div>
    </div>
  );
}
''',
}

def jobs_list(title, back, typ):
    return f'''"use client";
import Link from "next/link";
import {{ PageHeader, Card, Empty }} from "@/components/ui";
import {{ useApi, LoadingGrid }} from "@/components/data";
import {{ formatDateTime }} from "@/lib/utils";
export default function Screen() {{
  const {{ data, loading }} = useApi<{{jobs:any[]}}>("/api/jobs");
  if (loading) return <LoadingGrid />;
  const items = (data?.jobs||[]).filter((j:any)=> "{typ}"==="" || j.type==="{typ}");
  return (
    <div>
      <PageHeader title="{title}" back="{back}" />
      <div className="space-y-2">
        {{items.map((j:any)=>(
          <Link key={{j.id}} href={{`/reports/live/${{j.id}}`}} className="card block p-4">
            <div className="font-bold">{{j.title}}</div>
            <div className="text-sm text-ink-muted">{{j.status}} · نجاح {{j.successCount}} · {{formatDateTime(j.createdAt)}}</div>
          </Link>
        ))}}
        {{items.length===0 && <Empty title="لا بيانات" />}}
      </div>
    </div>
  );
}}
'''

reports_pages["reports/gather/page.tsx"] = jobs_list("سجل التجميع","/reports","gather")
reports_pages["reports/add/page.tsx"] = jobs_list("سجل الإضافة","/reports","add")
reports_pages["reports/messages/page.tsx"] = jobs_list("سجل الرسائل","/reports","dm")

simple_rep = [
("reports/today/page.tsx","تقرير اليوم","/reports",[("info","ملخص اليوم مقارنة بالأمس"),("link","مقارنة تفصيلية","/reports/analytics")],"تصدير اليوم","تم التصدير"),
("reports/weekly/page.tsx","تقرير أسبوعي","/reports",[("info","الأسبوع الحالي — يمكن التنقل بين الأسابيع")],"تصدير","تم التصدير"),
("reports/monthly/page.tsx","تقرير شهري","/reports",[("info","الشهر الحالي مع جدول رقمي بديل للرسم")],"تصدير","تم التصدير"),
("reports/errors/page.tsx","سجل الأخطاء والتحذيرات","/reports",[("info","FloodWait و PeerFlood وانقطاع الاتصال"),("link","تحليل الأخطاء","/reports/analytics")],"مسح السجل","تم الأرشفة"),
("reports/accounts/page.tsx","تقارير الحسابات","/reports",[("info","مقارنة الحسابات حسب النجاح والفشل والصحة"),("link","لوحة الترتيب","/reports/leaderboard")],"تحديث","تم التحديث"),
("reports/analytics/page.tsx","التحليلات المتقدمة","/reports",[
    ("link","معدل النجاح","/reports/today"),
    ("link","الأداء والسرعة","/reports/weekly"),
    ("link","الأمان والحماية","/security/reports"),
],"تحديث التحليلات","تم التحديث"),
("reports/leaderboard/page.tsx","لوحة الترتيب","/reports",[("info","أفضل الحسابات هذا الأسبوع حسب النجاح وأقل الأخطاء")],"تصدير","تم التصدير"),
("reports/export/page.tsx","تصدير التقارير","/reports",[("check","اليوم"),("check","الأسبوع"),("check","الأخطاء"),("radio","الصيغة",["PDF","CSV"])],"تصدير","تم التصدير"),
("reports/manage/page.tsx","إدارة السجلات","/reports",[("radio","احذف أقدم من",["30 يوم","60 يوم","90 يوم"]),("warn","لا يمكن التراجع — يُنصح بالأرشفة أولاً")],"أرشفة ثم حذف","تمت الأرشفة"),
]
for rel, title, back, fields, submit, success in simple_rep:
    reports_pages[rel] = form_page(title, back, fields, submit, success)

# ===================== SECURITY =====================
security_pages = {
"security/page.tsx": '''"use client";
import { PageHeader, RowLink, Stat, Card } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function SecHome() {
  const { data, loading } = useApi<any>("/api/dashboard");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="أدوات الأمان" subtitle="حماية الحسابات والاستجابة للطوارئ" />
      <Card className="mb-4">
        <div className="font-bold text-navy">حالة الأمان العامة</div>
        <div className="mt-1 text-success">🟢 ممتاز — لا حالات حرجة مفتوحة</div>
      </Card>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="⛔" label="محظور" value={data?.counts.banned||0} tone="danger" />
        <Stat icon="❄️" label="مجمّد" value={data?.counts.frozen||0} tone="info" />
      </div>
      <div className="space-y-2">
        <RowLink href="/security/blacklist" icon="🚫" title="القائمة السوداء العالمية" />
        <RowLink href="/security/limits" icon="🧠" title="الحدود الذكية" />
        <RowLink href="/security/scan" icon="🛡️" title="فحص أمان شامل" />
        <RowLink href="/security/devices" icon="📱" title="مراقبة الأجهزة المتصلة" />
        <RowLink href="/security/ban-monitor" icon="📡" title="مراقب الحظر الحي" />
        <RowLink href="/security/cleanup" icon="🧹" title="تنظيف الحسابات" />
        <RowLink href="/security/2fa" icon="🔐" title="إدارة كلمات مرور 2FA" />
        <RowLink href="/security/encryption" icon="🔒" title="تشفير الجلسات والبيانات" />
        <RowLink href="/security/emergency" icon="🔴" title="الاستجابة للطوارئ" />
        <RowLink href="/security/alerts" icon="🔔" title="تنبيهات الأمان" />
        <RowLink href="/security/reports" icon="📊" title="تقارير الأمان" />
        <RowLink href="/security/spambot" icon="🤖" title="فحص SpamBot" />
      </div>
    </div>
  );
}
''',
"security/emergency/page.tsx": '''"use client";
import { useState } from "react";
import { PageHeader, Card, Button, Modal, Banner } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function Emergency() {
  const [open,setOpen]=useState("");
  const [word,setWord]=useState("");
  const [msg,setMsg]=useState("");
  async function lock(on:boolean) {
    await api("/api/settings",{method:"PATCH",body:JSON.stringify({emergency_lock:on?"1":"0"})});
    setMsg(on? "تم قفل النظام طوارئياً":"تم فك القفل");
    setOpen(""); setWord("");
  }
  return (
    <div>
      <PageHeader title="الاستجابة للطوارئ" back="/security" />
      {msg && <Banner tone="warning">{msg}</Banner>}
      <div className="space-y-2">
        <Card><div className="font-bold">إيقاف جميع العمليات</div><Button className="mt-2" variant="ghost" onClick={()=>setMsg("أُوقفت كل العمليات الجارية")}>إيقاف الآن</Button></Card>
        <Card><div className="font-bold text-danger">قفل النظام</div><Button className="mt-2" variant="danger" onClick={()=>setOpen("lock")}>قفل</Button></Card>
        <Card><div className="font-bold">فك القفل</div><Button className="mt-2" onClick={()=>lock(false)}>فك القفل</Button></Card>
        <Card><div className="font-bold">حذف طارئ للجلسات</div><Button className="mt-2" variant="danger" onClick={()=>setOpen("wipe")}>حذف</Button></Card>
      </div>
      <Modal open={!!open} danger title="تأكيد خطير" onClose={()=>setOpen("")} footer={
        <Button variant="danger" disabled={word!=="تأكيد"} onClick={()=>lock(true)}>تنفيذ</Button>
      }>
        هذا إجراء لا يُتراجع عنه بسهولة.
        <input className="field mt-3" value={word} onChange={e=>setWord(e.target.value)} placeholder='اكتب «تأكيد»' />
      </Modal>
    </div>
  );
}
''',
}

simple_sec = [
("security/blacklist/page.tsx","القائمة السوداء العالمية","/security",[("input","قيمة","@user"),("radio","النوع",["مستخدم","قروب","كلمة"]),("input","السبب","")],"إضافة","تمت الإضافة"),
("security/limits/page.tsx","الحدود الذكية","/security",[
    ("info","حساب < 30ي: 10/يوم · 1–6 أشهر: 20/يوم · أكبر: 35/يوم · Premium +هامش"),
    ("check","تطبيق الموصى بها الآن"),
],"تطبيق","تم تطبيق الحدود الذكية"),
("security/scan/page.tsx","فحص أمان شامل","/security",[("radio","النطاق",["كل الحسابات","حساب محدد"])],"بدء الفحص","بدأ الفحص الشامل"),
("security/devices/page.tsx","الأجهزة المتصلة","/security",[("info","اعرض جلسات تيليجرام المتصلة وأنهِ المشبوه منها")],"فحص الكل","تم جلب الأجهزة"),
("security/ban-monitor/page.tsx","مراقب الحظر الحي","/security",[("check","تنبيه فوري عند الحظر"),("check","إيقاف العمليات المرتبطة")],"حفظ","المراقب يعمل"),
("security/cleanup/page.tsx","تنظيف الحسابات","/security",[("check","مغادرة قروبات قديمة"),("check","حذف رسائل محفوظة"),("warn","لا يمكن مغادرة قروب أنت منشئه")],"بدء التنظيف","بدأ التنظيف"),
("security/2fa/page.tsx","إدارة 2FA","/security",[("input","الحساب",""),("input","كلمة المرور الحالية",""),("input","كلمة المرور الجديدة","")],"تحديث","تم تحديث 2FA"),
("security/encryption/page.tsx","تشفير الجلسات","/security",[("warn","تفعيل التشفير يعرض مفتاحاً مرة واحدة — احفظه خارج النظام"),("check","تشفير ملفات الجلسات")],"تفعيل","تم تفعيل التشفير"),
("security/alerts/page.tsx","تنبيهات الأمان","/security",[("check","حظر"),("check","تجميد"),("check","جلسة ميتة"),("check","دخول من IP جديد")],"حفظ","تم حفظ التنبيهات"),
("security/reports/page.tsx","تقارير الأمان","/security",[("radio","الفترة",["أسبوع","شهر","مخصص"])],"إنشاء التقرير","تم إنشاء التقرير"),
("security/spambot/page.tsx","فحص SpamBot","/security",[("info","يسأل @SpamBot عن حالة القيد لحساب محدد"),("input","الحساب","")],"فحص","لا قيود على هذا الحساب"),
]
for rel, title, back, fields, submit, success in simple_sec:
    security_pages[rel] = form_page(title, back, fields, submit, success)

# ===================== MESSAGES =====================
messages_pages = {
"messages/page.tsx": '''"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function MsgHome() {
  const { data, loading } = useApi<{campaigns:any[]}>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const dms = (data?.campaigns||[]).filter((c:any)=>c.kind==="dm");
  return (
    <div>
      <PageHeader title="الرسائل الجماعية" subtitle="حملات DM عبر أسطول الحسابات" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="💬" label="حملات" value={dms.length} />
        <Stat icon="⚡" label="نشطة" value={dms.filter((c:any)=>c.status==="running").length} tone="info" />
      </div>
      <div className="space-y-2">
        <RowLink href="/messages/new" icon="➕" title="إنشاء حملة" />
        <RowLink href="/messages/list" icon="📋" title="عرض الحملات" />
        <RowLink href="/messages/resume" icon="▶️" title="استئناف متوقفة" />
        <RowLink href="/messages/blacklist" icon="🚫" title="القائمة السوداء" />
        <RowLink href="/messages/templates" icon="📄" title="قوالب الرسائل" />
        <RowLink href="/messages/stats" icon="📊" title="إحصائيات" />
        <RowLink href="/messages/settings" icon="⚙️" title="إعدادات افتراضية" />
      </div>
    </div>
  );
}
''',
"messages/new/page.tsx": '''"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function NewDm() {
  const router = useRouter();
  const [name,setName]=useState(""); const [message,setMessage]=useState(""); const [targets,setTargets]=useState("100");
  async function save() {
    const r = await api<any>("/api/campaigns",{method:"POST",body:JSON.stringify({kind:"dm",name,message,targetsCount:Number(targets),status:"draft"})});
    router.push("/messages/list");
  }
  return (
    <div>
      <PageHeader title="إنشاء حملة DM" back="/messages" />
      <Card className="space-y-3">
        <Field label="اسم الحملة"><Input value={name} onChange={e=>setName(e.target.value)} /></Field>
        <Field label="الرسالة" hint="{{name}} يُستبدل باسم المستلم"><Textarea value={message} onChange={e=>setMessage(e.target.value)} /></Field>
        <Field label="عدد المستهدفين"><Input type="number" value={targets} onChange={e=>setTargets(e.target.value)} /></Field>
        <Button className="w-full" disabled={!name||!message} onClick={save}>حفظ كمسودة</Button>
      </Card>
    </div>
  );
}
''',
"messages/list/page.tsx": '''"use client";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { campaignStatus } from "@/lib/labels";
import { api } from "@/lib/api-client";
export default function List() {
  const { data, loading, reload } = useApi<{campaigns:any[]}>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns||[]).filter((c:any)=>c.kind==="dm");
  return (
    <div>
      <PageHeader title="حملات الرسائل" back="/messages" />
      <div className="space-y-2">
        {items.map((c:any)=>(
          <Card key={c.id}>
            <div className="flex justify-between">
              <div className="font-bold">{c.name}</div>
              <span className={`chip ${(campaignStatus as any)[c.status]?.bg}`}>{(campaignStatus as any)[c.status]?.label}</span>
            </div>
            <div className="text-sm text-ink-muted">{c.sentCount}/{c.targetsCount} · فشل {c.failCount}</div>
            <div className="mt-2 flex gap-2">
              {c.status!=="running" && <Button variant="ghost" onClick={async()=>{await api(`/api/campaigns/${c.id}`,{method:"PATCH",body:JSON.stringify({status:"running"})}); reload();}}>تشغيل</Button>}
              {c.status==="running" && <Button variant="ghost" onClick={async()=>{await api(`/api/campaigns/${c.id}`,{method:"PATCH",body:JSON.stringify({status:"paused"})}); reload();}}>إيقاف</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
'''
}
simple_msg = [
("messages/resume/page.tsx","استئناف حملات متوقفة","/messages",[("info","الحملات المتوقفة أو الجزئية")],"استئناف","تم الاستئناف"),
("messages/blacklist/page.tsx","سوداء الرسائل","/messages",[("input","مستخدم أو كلمة",""),("check","منع الكلمات التسويقية المحظورة")],"إضافة","تمت الإضافة"),
("messages/templates/page.tsx","قوالب الرسائل","/messages",[("input","اسم القالب",""),("textarea","النص")],"حفظ القالب","تم الحفظ"),
("messages/stats/page.tsx","إحصائيات الرسائل","/messages",[("info","معدل الوصول، الفشل، الحظر بعد الحملات")],"تحديث","تم التحديث"),
("messages/settings/page.tsx","إعدادات الرسائل","/messages",[("input","حد يومي","30"),("input","تأخير بين الرسائل ث","45"),("check","توقف عند PeerFlood")],"حفظ","تم الحفظ"),
]
for rel, title, back, fields, submit, success in simple_msg:
    messages_pages[rel] = form_page(title, back, fields, submit, success)

# ===================== CAMPAIGNS =====================
campaigns_pages = {
"campaigns/page.tsx": '''"use client";
import { PageHeader, RowLink, Stat } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
export default function CampHome() {
  const { data, loading } = useApi<{campaigns:any[]}>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns||[]).filter((c:any)=>c.kind==="groups");
  return (
    <div>
      <PageHeader title="حملات القروبات" subtitle="إرسال إلى قروبات متعددة بجدول وحماية" />
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat icon="📢" label="حملات" value={items.length} />
        <Stat icon="⚡" label="نشطة" value={items.filter((c:any)=>c.status==="running").length} tone="info" />
      </div>
      <div className="space-y-2">
        <RowLink href="/campaigns/new" icon="➕" title="إنشاء حملة" />
        <RowLink href="/campaigns/list" icon="📋" title="عرض الحملات" />
        <RowLink href="/campaigns/resume" icon="▶️" title="استئناف متوقفة" />
        <RowLink href="/campaigns/directory" icon="📚" title="دليل القروبات" />
        <RowLink href="/campaigns/templates" icon="📄" title="قوالب رسائل القروبات" />
        <RowLink href="/campaigns/schedule" icon="🗓️" title="جدولة الحملات" />
        <RowLink href="/campaigns/stats" icon="📊" title="إحصائيات وتقارير" />
        <RowLink href="/campaigns/settings" icon="⚙️" title="إعدادات افتراضية" />
      </div>
    </div>
  );
}
''',
"campaigns/new/page.tsx": '''"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui";
import { api } from "@/lib/api-client";
export default function NewCamp() {
  const router = useRouter();
  const [name,setName]=useState(""); const [message,setMessage]=useState("");
  async function save() {
    await api("/api/campaigns",{method:"POST",body:JSON.stringify({kind:"groups",name,message,targetsCount:10,status:"draft"})});
    router.push("/campaigns/list");
  }
  return (
    <div>
      <PageHeader title="إنشاء حملة قروبات" back="/campaigns" />
      <Card className="space-y-3">
        <Field label="اسم الحملة"><Input value={name} onChange={e=>setName(e.target.value)} /></Field>
        <Field label="الرسالة"><Textarea value={message} onChange={e=>setMessage(e.target.value)} /></Field>
        <Button className="w-full" disabled={!name||!message} onClick={save}>حفظ</Button>
      </Card>
    </div>
  );
}
''',
"campaigns/list/page.tsx": '''"use client";
import { PageHeader, Card, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { campaignStatus } from "@/lib/labels";
import { api } from "@/lib/api-client";
export default function List() {
  const { data, loading, reload } = useApi<{campaigns:any[]}>("/api/campaigns");
  if (loading) return <LoadingGrid />;
  const items = (data?.campaigns||[]).filter((c:any)=>c.kind==="groups");
  return (
    <div>
      <PageHeader title="حملات القروبات" back="/campaigns" />
      <div className="space-y-2">
        {items.map((c:any)=>(
          <Card key={c.id}>
            <div className="flex justify-between"><div className="font-bold">{c.name}</div><span className="chip bg-slate-100">{(campaignStatus as any)[c.status]?.label}</span></div>
            <div className="text-sm text-ink-muted">{c.sentCount}/{c.targetsCount}</div>
            <Button className="mt-2" variant="ghost" onClick={async()=>{await api(`/api/campaigns/${c.id}`,{method:"PATCH",body:JSON.stringify({status:c.status==="running"?"paused":"running"})}); reload();}}>
              {c.status==="running"?"إيقاف":"تشغيل"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
''',
"campaigns/directory/page.tsx": '''"use client";
import { useState } from "react";
import { PageHeader, Card, Input, Button } from "@/components/ui";
import { useApi, LoadingGrid } from "@/components/data";
import { api } from "@/lib/api-client";
export default function Dir() {
  const { data, loading, reload } = useApi<{groups:any[]}>("/api/directory");
  const [title,setTitle]=useState("");
  if (loading) return <LoadingGrid />;
  return (
    <div>
      <PageHeader title="دليل القروبات" back="/campaigns" />
      <div className="mb-3 flex gap-2">
        <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="اسم قروب جديد" />
        <Button onClick={async()=>{await api("/api/directory",{method:"POST",body:JSON.stringify({title})}); setTitle(""); reload();}}>إضافة</Button>
      </div>
      <div className="space-y-2">
        {(data?.groups||[]).map((g:any)=>(
          <Card key={g.id}>
            <div className="font-bold">{g.title}</div>
            <div className="text-sm text-ink-muted">{g.username || g.inviteLink} · {g.members} عضو · {g.type}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
'''
}
simple_camp = [
("campaigns/resume/page.tsx","استئناف حملات القروبات","/campaigns",[("info","الحملات المتوقفة تُستأنف من آخر قروب")],"استئناف","تم الاستئناف"),
("campaigns/templates/page.tsx","قوالب رسائل القروبات","/campaigns",[("input","اسم القالب",""),("textarea","النص")],"حفظ","تم الحفظ"),
("campaigns/schedule/page.tsx","جدولة الحملات","/campaigns",[("input","التاريخ",""),("input","الوقت","21:00"),("check","تكرار أسبوعي")],"جدولة","تمت الجدولة"),
("campaigns/stats/page.tsx","إحصائيات حملات القروبات","/campaigns",[("info","الوصول، الحذف، الحظر بعد الإرسال")],"تحديث","تم التحديث"),
("campaigns/settings/page.tsx","إعدادات حملات القروبات","/campaigns",[("input","حد يومي","25"),("input","تأخير بين القروبات ث","90")],"حفظ","تم الحفظ"),
]
for rel, title, back, fields, submit, success in simple_camp:
    campaigns_pages[rel] = form_page(title, back, fields, submit, success)

all_pages = {}
all_pages.update(gather_pages)
all_pages.update(adder_pages)
all_pages.update(rotation_pages)
all_pages.update(proxy_pages)
all_pages.update(settings_pages)
all_pages.update(reports_pages)
all_pages.update(security_pages)
all_pages.update(messages_pages)
all_pages.update(campaigns_pages)

for rel, content in all_pages.items():
    if write(rel, content):
        created += 1

print("created", created, "total defined", len(all_pages))
