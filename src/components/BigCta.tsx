import type { Dictionary } from "@/i18n/dictionaries";
import { whatsappUrl } from "@/content/profile";
import { WhatsAppIcon } from "./icons";

/** Oversized closing line before the contact section. The words fill with color as they scroll in. */
export function BigCta({ dict }: { dict: Dictionary["cta"] }) {
  return (
    <section className="relative isolate overflow-hidden border-t border-border py-24 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="font-mono text-sm text-muted" dir="ltr">
          <span className="text-accent">➜</span> <span className="text-accent-2">~</span> ./start-project.sh
          <span className="cursor" />
        </p>
        <h2 className="cta-fill mt-6 text-5xl leading-[1.05] font-bold tracking-tighter sm:text-7xl lg:text-8xl">
          {dict.line1}
          <br />
          {dict.line2}
        </h2>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-medium text-black shadow-[0_0_40px_-8px_var(--accent)] transition hover:brightness-110"
          >
            {dict.button} <span className="inline-block rtl:rotate-180">→</span>
          </a>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#25d366]/40 bg-[#25d366]/10 px-7 py-3.5 font-medium text-[#25d366] transition hover:bg-[#25d366]/20"
            >
              <WhatsAppIcon className="size-4" /> {dict.whatsapp}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
