import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { contact } from "@/content/profile";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { skillGroups } from "@/content/profile";
import { siteUrl } from "@/lib/site";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary();
  const { hero } = dict;

  // Structured data so search engines know who this site is about.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Youssef Atia",
    alternateName: "يوسف عطية",
    jobTitle: "Full-stack Developer",
    description: hero.tagline,
    url: new URL(`/${locale}`, siteUrl).href,
    email: `mailto:${contact.email}`,
    sameAs: [contact.github],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Egyptian Chinese University" },
    knowsAbout: skillGroups.flatMap((g) => g.items),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col justify-center px-6 py-20">
        <p className="text-lg text-muted">{hero.greeting}</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight sm:text-7xl">{hero.name}</h1>
        <p className="mt-6 max-w-2xl text-xl text-muted sm:text-2xl">{hero.tagline}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            {hero.ctaProjects}
          </a>
          <a
            href={contact.cv}
            download
            className="rounded-full border border-border px-6 py-3 font-medium transition hover:bg-surface"
          >
            {hero.ctaCv}
          </a>
        </div>
      </section>

      <About locale={locale} dict={dict.about} />
      <Projects locale={locale} dict={dict.projects} />
      <Experience locale={locale} dict={dict.experience} />
      <Contact dict={dict.contact} />
    </>
  );
}
