import type { Dictionary } from "@/i18n/dictionaries";
import { contact } from "@/content/profile";
import { ContactForm } from "../ContactForm";
import { GithubIcon, MailIcon } from "../icons";

export function Contact({ dict }: { dict: Dictionary["contact"] }) {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{dict.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{dict.text}</p>
        </div>

        <div className="relative mt-10">
          <ContactForm t={dict.form} />
        </div>

        <p className="mt-10 text-center text-sm text-muted">{dict.form.or}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm font-medium">
          <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 transition hover:bg-surface">
            <MailIcon className="size-4" /> <span dir="ltr">{contact.email}</span>
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 transition hover:bg-surface"
          >
            <GithubIcon className="size-4" /> {dict.github}
          </a>
        </div>
      </div>
    </section>
  );
}
