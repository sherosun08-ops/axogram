"use client";
import { PageHeader, Card, Button, Banner } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

const PRESETS = [
  { id: "conservative", t: "محافظ", h: "تأخيرات طويلة وحدود منخفضة" },
  { id: "balanced", t: "متوازن ⭐", h: "التوازن الافتراضي" },
  { id: "aggressive", t: "عدواني", h: "سرعة عالية — مخاطر مرتفعة" },
  { id: "night", t: "ليلي", h: "دوام 22:00–06:00" },
];

export default function Page() {
  const op = useOp();
  return (
    <div>
      <PageHeader title="سيناريوهات جاهزة" back="/rotation" />
      <Feedback err={op.err} msg={op.msg} />
      <Banner tone="warning">التطبيق يستبدل إعدادات التدوير الحالية</Banner>
      <div className="space-y-2">
        {PRESETS.map((p) => (
          <Card key={p.id} className="flex items-center justify-between">
            <div><div className="font-bold">{p.t}</div><div className="text-sm text-ink-muted">{p.h}</div></div>
            <Button onClick={async () => { await op.run("apply_preset", { id: p.id }); op.setMsg("تم تطبيق «" + p.t + "»"); }}>تطبيق</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
