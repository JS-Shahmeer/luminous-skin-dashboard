import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default async function CatalogLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) return <PublicHeader>{children}</PublicHeader>;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, title: true, role: true },
  });
  if (!user) return <PublicHeader>{children}</PublicHeader>;

  const role = user.role === "ADMIN" ? "admin" : "student";
  return (
    <AppShell
      role={role}
      user={{ name: user.name, title: user.title ?? (role === "admin" ? "Academy Admin" : "Student"), role: user.role }}
    >
      {children}
    </AppShell>
  );
}
