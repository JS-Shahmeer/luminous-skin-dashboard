import { CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ credentialId: string }>;
}) {
  const { credentialId } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { credentialId },
    include: { user: { select: { name: true } }, course: { select: { title: true } } },
  });

  return (
    <div className="flex min-h-screen flex-col items-center bg-ink px-6 py-16">
      <Logo />

      <div className="mt-12 w-full max-w-md rounded-lg border border-line bg-charcoal p-8 text-center">
        {certificate ? (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-sage/40 text-sage">
              <CheckCircle2 size={28} strokeWidth={1.75} />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Certificate Verified
            </p>
            <p className="mt-4 font-serif text-2xl text-cream">{certificate.user.name}</p>
            <p className="mt-1 text-sm text-beige">has successfully completed</p>
            <p className="mt-1 font-serif text-lg text-gold">{certificate.course.title}</p>
            <div className="mt-6 space-y-1 border-t border-line pt-5 text-xs text-beige">
              <p>Issued {format(certificate.issuedAt, "d MMMM yyyy")}</p>
              <p>Credential ID: {certificate.credentialId}</p>
            </div>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-rust/40 text-rust">
              <XCircle size={28} strokeWidth={1.75} />
            </span>
            <p className="mt-5 font-serif text-xl text-cream">Certificate not found</p>
            <p className="mt-2 text-sm text-beige">
              We couldn&apos;t find a certificate with credential ID{" "}
              <span className="text-cream">{credentialId}</span>.
            </p>
          </>
        )}
      </div>

      <Button href="/" variant="ghost" size="sm" className="mt-8">
        Visit Luminous SKN Academy
      </Button>
    </div>
  );
}
