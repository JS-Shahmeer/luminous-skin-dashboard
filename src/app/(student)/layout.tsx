import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, title: true, role: true },
  });
  if (!user) redirect("/login");

  return (
    <AppShell role="student" user={{ name: user.name, title: user.title ?? "Student", role: user.role }}>
      {children}
    </AppShell>
  );
}
