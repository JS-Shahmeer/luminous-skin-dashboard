import { Award, Download, Lock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Certificate } from "@/types/models";

export function CertificateCard({
  certificate,
  studentName,
}: {
  certificate: Certificate;
  studentName: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gold/25 bg-charcoal">
      <div className="ambient-glow texture-grain relative border-b border-line p-7">
        <div className="pointer-events-none absolute inset-3 rounded-md border border-gold/20" />
        <div className="relative flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold">
            <Award size={18} strokeWidth={1.75} />
          </span>
          <span className="font-serif text-sm tracking-wide text-beige">Luminous SKN Academy</span>
        </div>
        <p className="relative mt-6 text-center text-[11px] uppercase tracking-[0.3em] text-gold">
          Certificate of Completion
        </p>
        <p className="relative mt-3 text-center font-serif text-2xl text-cream">
          {studentName}
        </p>
        <p className="relative mt-2 text-center text-sm text-beige">has successfully completed</p>
        <p className="relative mt-1 text-center font-serif text-lg text-gold">
          {certificate.courseTitle}
        </p>
      </div>
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs text-beige">Issued {certificate.issuedOn}</p>
          <p className="text-[11px] text-beige/70">ID: {certificate.credentialId}</p>
        </div>
        <div className="flex gap-2">
          <Button
            href={`/verify/${certificate.credentialId}`}
            variant="ghost"
            size="sm"
            icon={<Share2 size={14} />}
            aria-label="View public verification page"
          />
          <Button
            href={`/api/certificates/${certificate.id}/pdf`}
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

export function LockedCertificateCard({
  courseTitle,
  progress,
}: {
  courseTitle: string;
  progress: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-charcoal/50 p-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-beige">
        <Lock size={17} strokeWidth={1.75} />
      </span>
      <p className="mt-4 font-serif text-lg text-beige">{courseTitle}</p>
      <p className="mt-1 text-xs text-beige/70">{progress}% complete — finish the course to unlock</p>
    </div>
  );
}
