import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { privacyPolicySections, privacyPolicyLastUpdated } from "@/content/privacy-policy";

function SectionBody({ text }: { text: string }) {
  const blocks = text.split("\n\n");
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean);
        const isList = lines.every((l) => l.startsWith("• ")) && lines.length > 1;
        if (isList) {
          return (
            <ul key={i} className="list-none space-y-1.5 pl-1">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-2 text-sm leading-relaxed text-beige">
                  <span className="text-gold">•</span>
                  <span>{line.replace(/^•\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <div key={i} className="space-y-2">
            {lines.map((line, li) => (
              <p key={li} className="text-sm leading-relaxed text-beige">
                {line}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-ink">
      <header className="flex h-20 items-center justify-between border-b border-line px-5 md:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/catalog" className="text-sm text-beige hover:text-gold">
          Browse Courses
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Legal</p>
        <h1 className="mt-2 font-serif text-3xl text-cream md:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-beige">Last updated {privacyPolicyLastUpdated}</p>

        <div className="mt-10 space-y-10">
          {privacyPolicySections.map((section, i) => (
            <section key={section.heading} id={`section-${i + 1}`}>
              <h2 className="font-serif text-xl text-cream">
                {i + 1}. {section.heading}
              </h2>
              <div className="mt-3">
                <SectionBody text={section.body} />
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
