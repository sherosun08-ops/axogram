"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Field, Input, Button, Banner } from "@/components/ui";
import { Feedback, useOp } from "@/components/prod";

export default function Page() {
  const op = useOp();
  const [link, setLink] = useState("");
  const [res, setRes] = useState<any>(null);
  return (
    <div>
      <PageHeader title="فحص ظهور الأعضاء" back="/gather" />
      <Feedback err={op.err} />
      <Card className="space-y-3">
        <Field label="رابط القروب"><Input value={link} onChange={(e) => setLink(e.target.value)} /></Field>
        <Button disabled={!link || op.busy} onClick={async () => setRes(await op.run("visibility", { link }))}>فحص</Button>
        {res && (
          <>
            <Banner tone={res.hidden ? "warning" : "success"}>{res.message}</Banner>
            {res.hidden && (
              <div className="flex gap-2">
                <Link href="/gather/messages" className="btn-ghost flex-1">تجميع من الرسائل</Link>
                <Link href="/gather/reactions" className="btn-ghost flex-1">من التفاعلات</Link>
              </div>
            )}
            {!res.hidden && <Link href="/gather/public" className="btn-primary w-full">تجميع مباشر</Link>}
          </>
        )}
      </Card>
    </div>
  );
}
