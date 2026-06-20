import { AppShell } from "@/components/app/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return <AppShell>{children}</AppShell>;
}
