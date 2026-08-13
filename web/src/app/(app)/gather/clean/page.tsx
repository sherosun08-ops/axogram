"use client";
import { useState } from "react";
import { PageHeader, Card, Button } from "@/components/ui";
import { Feedback, FileSelect, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [fileId, setFileId] = useState("");
  const [dupes, setDupes] = useState(true);
  const [noUsername, setNoUsername] = useState(true);
  const [bots, setBots] = useState(true);
  const [black, setBlack] = useState(true);
  const [res, setRes] = useState<any>(null);
  return (
    <div>
      <PageHeader title="تنقية ملف" back="/gather" />
      <Feedback err={op.err} msg={op.msg} />
      <Card className="space-y-3">
        <FileSelect value={fileId} onChange={setFileId} />
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={dupes} onChange={(e) => setDupes(e.target.checked)} /> حذف المكرر</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={noUsername} onChange={(e) => setNoUsername(e.target.checked)} /> حذف بدون يوزرنيم</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={bots} onChange={(e) => setBots(e.target.checked)} /> حذف البوتات</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={black} onChange={(e) => setBlack(e.target.checked)} /> حذف المحظورين في السوداء</label>
        <Button className="w-full" disabled={!fileId || op.busy} onClick={async () => {
          const r = await op.run("clean_file", { fileId, dupes, noUsername, bots, black });
          setRes(r);
          op.setMsg(`اكتملت التنقية — حُذف ${r.removed} وبقي ${r.after}`);
        }}>تنقية</Button>
        {res && <div className="text-sm">قبل: {res.before} · بعد: {res.after} · محذوف: {res.removed}</div>}
      </Card>
    </div>
  );
}
