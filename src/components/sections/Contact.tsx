import type { Dictionary } from "@/i18n/dictionaries";
import { contact, whatsappUrl } from "@/content/profile";
import { ContactForm } from "../ContactForm";
import { Window } from "../Section";
import { DownloadIcon, GithubIcon, MailIcon, WhatsAppIcon } from "../icons";

export function Contact({ dict }: { dict: Dictionary["contact"] }) {
  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <div className="glow absolute -bottom-40 start-1/2 -z-10 size-[36rem] -translate-x-1/2 rtl:translate-x-1/2" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <div>
          <span className="font-mono text-sm text-accent" dir="ltr">
            04.
          </span>
          <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{dict.title}</h2>
          <p className="mt-5 max-w-md text-lg text-muted">{dict.text}</p>

          <p className="mt-10 font-mono text-xs text-muted">{dict.form.or}</p>
          <div className="mt-3 flex flex-col gap-3 text-sm font-medium">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-3 rounded-lg border border-[#25d366]/40 bg-[#25d366]/10 px-4 py-2.5 text-[#25d366] transition hover:bg-[#25d366]/20"
              >
                <WhatsAppIcon className="size-4" /> {dict.whatsapp}
              </a>
            )}
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex w-fit items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 transition hover:border-accent/50"
            >
              <MailIcon className="size-4 text-accent" /> <span dir="ltr">{contact.email}</span>
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 transition hover:border-accent/50"
            >
              <GithubIcon className="size-4 text-accent" /> <span dir="ltr">github.com/YoussefAtia17</span>
            </a>
            <a
              href={contact.cv}
              download
              className="inline-flex w-fit items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 transition hover:border-accent/50"
            >
              <DownloadIcon className="size-4 text-accent" /> {dict.cv} <span className="font-mono text-xs text-muted">PDF</span>
            </a>
          </div>
        </div>

        <Window title="./contact.sh" className="relative">
          <ContactForm t={dict.form} />
        </Window>
      </div>
    </section>
  );
}
