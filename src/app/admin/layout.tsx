import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, title: true, role: true },
  });
  if (!user) redirect("/login");

  return (
    <AppShell role="admin" user={{ name: user.name, title: user.title ?? "Academy Admin", role: user.role }}>
      {children}
    </AppShell>
  );
}
