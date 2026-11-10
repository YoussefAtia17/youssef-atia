import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { contact } from "@/content/profile";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { TechMarquee } from "@/components/TechMarquee";
import { BigCta } from "@/components/BigCta";
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
      <Hero locale={locale} dict={hero} />
      <TechMarquee label={hero.techLabel} />

      <About locale={locale} dict={dict.about} />
      <Projects locale={locale} dict={dict.projects} />
      <Experience locale={locale} dict={dict.experience} />
      <BigCta dict={dict.cta} />
      <Contact dict={dict.contact} />
    </>
  );
}
