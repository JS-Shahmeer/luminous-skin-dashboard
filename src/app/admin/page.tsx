import Link from "next/link";
import { Award, GraduationCap, Plus, Users, Wallet, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { listCourses } from "@/lib/queries/courses";
import { getAdminCertificates, getAdminOrders, getAdminStudents, getRevenueByMonth } from "@/lib/queries/admin";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const [courses, adminStudents, adminOrders, adminCertificates, revenueByMonth] = await Promise.all([
    listCourses(),
    getAdminStudents(),
    getAdminOrders(),
    getAdminCertificates(),
    getRevenueByMonth(),
  ]);

  const totalRevenue = courses.reduce((sum, c) => sum + c.price * c.studentsEnrolled, 0);
  const activeStudents = adminStudents.filter((s) => s.status === "active").length;
  const topCourses = [...courses].sort((a, b) => b.studentsEnrolled - a.studentsEnrolled).slice(0, 4);
  const recentOrders = adminOrders.slice(0, 5);

  const statusTone = { paid: "sage", pending: "gold", refunded: "rust" } as const;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Academy Overview"
        description="Revenue, enrollments and course performance across Luminous SKN Academy."
        actions={
          <Button href="/admin/courses" icon={<Plus size={15} />}>
            Add Course
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={Wallet} trend={16} trendLabel="vs last quarter" />
        <StatCard label="Active Students" value={String(activeStudents)} icon={Users} trend={8} trendLabel="this month" />
        <StatCard label="Courses Published" value={String(courses.length)} icon={GraduationCap} />
        <StatCard label="Certificates Issued" value={String(adminCertificates.length)} icon={Award} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-line bg-charcoal p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-cream">Revenue — Last 6 Months</h3>
            <Badge tone="gold">+16% growth</Badge>
          </div>
          <div className="mt-6">
            <RevenueChart data={revenueByMonth} />
          </div>
        </div>

        <div className="rounded-lg border border-line bg-charcoal p-6">
          <h3 className="font-serif text-lg text-cream">Top Courses</h3>
          <div className="mt-4 space-y-4">
            {topCourses.map((c) => (
              <div key={c.slug} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-cream">{c.title}</p>
                  <p className="text-xs text-beige">{c.studentsEnrolled} students</p>
                </div>
                <span className="shrink-0 text-sm text-gold">{formatCurrency(c.price * c.studentsEnrolled)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-charcoal">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h3 className="font-serif text-lg text-cream">Recent Orders</h3>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-gold hover:text-gold-soft">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-line">
          {recentOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="text-sm text-cream">{o.student}</p>
                <p className="truncate text-xs text-beige">{o.course}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="hidden text-xs text-beige sm:inline">{o.date}</span>
                <span className="text-sm text-cream">{formatCurrency(o.amount)}</span>
                <Badge tone={statusTone[o.status]}>{o.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
