import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

type Props = { locale: Locale; nav: Dictionary["nav"] };

export function Navbar({ locale, nav }: Props) {
  const links = [
    { href: "#about", label: nav.about },
    { href: "#projects", label: nav.projects },
    { href: "#experience", label: nav.experience },
    { href: "#contact", label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <a href={`/${locale}`} className="text-lg font-bold">
          YA<span className="text-accent">.</span>
        </a>
        <ul className="hidden items-center gap-6 text-sm text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-foreground">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={nav.switchLanguage} />
          <ThemeToggle label={nav.toggleTheme} />
          <MobileMenu links={links} openLabel={nav.openMenu} closeLabel={nav.closeMenu} />
        </div>
      </nav>
    </header>
  );
}
