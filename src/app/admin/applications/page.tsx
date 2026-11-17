import { Bell, Check, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getActiveInClinicStudents, getPendingApplications } from "@/lib/queries/admin";
import { formatCurrency } from "@/lib/utils";
import { approveApplicationAction, rejectApplicationAction, sendInClinicReminderAction } from "./actions";

export default async function AdminApplicationsPage() {
  const [applications, activeStudents] = await Promise.all([
    getPendingApplications(),
    getActiveInClinicStudents(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Manage"
        title="In-Clinic Applications"
        description="Review applications for the in-clinic training programs before they're confirmed."
      />

      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-beige">
          Pending Applications ({applications.length})
        </p>
        {applications.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line p-12 text-center text-sm text-beige">
            No pending applications right now.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((a) => (
              <div key={a.id} className="rounded-lg border border-line bg-charcoal p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-cream">{a.studentName}</p>
                    <p className="text-xs text-beige">{a.studentEmail}</p>
                    <p className="mt-2 font-serif text-lg text-gold">{a.course}</p>
                    <p className="text-xs text-beige">
                      {formatCurrency(a.price)} · Applied {a.appliedOn}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action={rejectApplicationAction}>
                      <input type="hidden" name="enrollmentId" value={a.id} />
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 rounded-sm border border-line px-3.5 py-2 text-xs text-beige transition-colors hover:border-rust/50 hover:text-rust"
                      >
                        <X size={13} /> Reject
                      </button>
                    </form>
                    <form action={approveApplicationAction}>
                      <input type="hidden" name="enrollmentId" value={a.id} />
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 rounded-sm bg-gold px-3.5 py-2 text-xs font-medium text-on-gold transition-colors hover:bg-gold-soft"
                      >
                        <Check size={13} /> Approve
                      </button>
                    </form>
                  </div>
                </div>
                {a.notes && (
                  <p className="mt-3 border-t border-line pt-3 text-sm text-beige">
                    &ldquo;{a.notes}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-beige">
          Active In-Clinic Students ({activeStudents.length})
        </p>
        {activeStudents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line p-12 text-center text-sm text-beige">
            No active in-clinic students right now.
          </div>
        ) : (
          <div className="space-y-4">
            {activeStudents.map((s) => (
              <div key={s.enrollmentId} className="rounded-lg border border-line bg-charcoal p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-cream">{s.studentName}</p>
                    <p className="text-xs text-beige">{s.studentEmail}</p>
                    <p className="mt-2 font-serif text-lg text-gold">{s.course}</p>
                    <div className="mt-2 flex max-w-xs items-center gap-2">
                      <ProgressBar value={s.progress} className="w-32" />
                      <span className="text-xs text-beige">{s.progress}%</span>
                    </div>
                    <p className="mt-1 text-xs text-beige/70">
                      Enrolled {s.enrolledOn}
                      {s.lastReminderSentOn ? ` · Last reminder sent ${s.lastReminderSentOn}` : ""}
                    </p>
                  </div>
                  <form action={sendInClinicReminderAction}>
                    <input type="hidden" name="enrollmentId" value={s.enrollmentId} />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-sm border border-line px-3.5 py-2 text-xs text-beige transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      <Bell size={13} /> Send Reminder
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
