"use client";
import Link from "next/link";
import { useState } from "react";
import { PageHeader, Card, Button, Field, Input, Textarea, Banner, RowLink, Radio, Toggle, Segment, Stat, Progress, Empty } from "@/components/ui";

export default function Screen() {
  const [msg,setMsg]=useState("");
  const [val,setVal]=useState("");
  const [busy,setBusy]=useState(false);
  return (
    <div>
      <PageHeader title="متعدد المصادر" back="/adder" />
      {msg && <Banner tone="success">{msg}</Banner>}
      <Card className="space-y-3">
        <Field label="ملفات أو روابط مصادر"><Textarea placeholder="ملفات أو روابط مصادر" /></Field>
        <Field label="القروب الهدف" hint=""><Input placeholder="القروب الهدف" /></Field>
        <Button className="w-full" disabled={busy} onClick={()=>{setBusy(true); setTimeout(()=>{setBusy(false); setMsg("بدأت العملية");},600);}}>{busy?"جاري...":"بدء"}</Button>
      </Card>
    </div>
  );
}
