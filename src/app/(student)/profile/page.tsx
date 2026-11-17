import { Bell, Lock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { auth } from "@/auth";
import { getCertificatesForUser, getEnrollmentsForUser, getStudentProfile } from "@/lib/queries/student";
import { getInitials } from "@/lib/utils";
import { ProfileInfoForm } from "./ProfileInfoForm";
import { PasswordForm } from "./PasswordForm";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session!.user.id;

  const [profile, enrollments, certificates] = await Promise.all([
    getStudentProfile(userId),
    getEnrollmentsForUser(userId),
    getCertificatesForUser(userId),
  ]);
  if (!profile) return null;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Account" title="Profile & Settings" description="Manage your personal details and preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-line bg-charcoal p-6 text-center lg:col-span-1">
          <div className="flex justify-center">
            <Avatar initials={getInitials(profile.name)} size={84} />
          </div>
          <p className="mt-4 font-serif text-xl text-cream">{profile.name}</p>
          <p className="text-sm text-beige">{profile.title}</p>
          <div className="mt-3 flex justify-center">
            <Badge tone="gold">Member since {profile.memberSince}</Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-6 text-left">
            <div>
              <p className="font-serif text-2xl text-cream">{enrollments.length}</p>
              <p className="text-xs text-beige">Courses</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-cream">{certificates.length}</p>
              <p className="text-xs text-beige">Certificates</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="mt-6 w-full">
            Change Photo
          </Button>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-line bg-charcoal p-6">
            <h3 className="font-serif text-lg text-cream">Personal Information</h3>
            <div className="mt-5">
              <ProfileInfoForm name={profile.name} email={profile.email} title={profile.title} />
            </div>
          </div>

          <div className="rounded-lg border border-line bg-charcoal p-6">
            <h3 className="flex items-center gap-2 font-serif text-lg text-cream">
              <Lock size={16} className="text-gold" /> Security
            </h3>
            <div className="mt-5">
              <PasswordForm />
            </div>
          </div>

          <div className="rounded-lg border border-line bg-charcoal p-6">
            <h3 className="flex items-center gap-2 font-serif text-lg text-cream">
              <Bell size={16} className="text-gold" /> Notifications
            </h3>
            <div className="mt-4 space-y-4">
              {[
                "New course announcements",
                "Certificate & achievement alerts",
                "In-clinic training reminders",
              ].map((label) => (
                <label key={label} className="flex items-center justify-between text-sm text-beige">
                  {label}
                  <input type="checkbox" defaultChecked className="accent-[#C6A875]" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
