import { redirect } from "next/navigation";
import { getSession, getSettingsMap } from "@/lib/auth";
import { AppShell } from "@/components/shell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  const settings = await getSettingsMap();
  return (
    <AppShell user={user} settings={settings}>
      {children}
    </AppShell>
  );
}
