import type { Localized } from "./types";

export type Project = {
  slug: string;
  title: Localized;
  summary: Localized;
  stack: string[];
  /** Shown as a small badge, e.g. client name or research. */
  badge?: Localized;
  /** Your part when it was a team project. */
  role?: Localized;
  live?: string;
  github?: string;
  /** Repo is private: shows a "private code" note instead of a GitHub link. */
  privateCode?: boolean;
  /** Tailwind gradient used for the card cover until real screenshots are added. */
  cover: string;
};

const GH = "https://github.com/YoussefAtia17";

export const featuredProjects: Project[] = [
  {
    slug: "ara-fed",
    title: { en: "ARA-Fed", ar: "ARA-Fed" },
    summary: {
      en: "Adaptive, resource-aware federated learning framework. Smarter client scheduling and loss-adaptive aggregation beat FedAvg, FedProx, SCAFFOLD, FedNova and MOON across vision, NLP and audio on 100 simulated clients (CIFAR-10: 71% vs 52% for FedAvg).",
      ar: "إطار Federated Learning بيتكيّف مع موارد الأجهزة. جدولة أذكى للعملاء وتجميع بيتكيّف مع الـ loss، ونتايجه أحسن من FedAvg وFedProx وSCAFFOLD وFedNova وMOON في الصور والنصوص والصوت على 100 عميل (CIFAR-10: ‎71%‎ مقابل ‎52%‎ لـ FedAvg).",
    },
    badge: { en: "Research", ar: "بحث" },
    stack: ["Python", "PyTorch", "Federated Learning"],
    github: `${GH}/ARA-Fed-Simulation`,
    cover: "from-indigo-500 to-cyan-400",
  },
  {
    slug: "royal-palace",
    title: { en: "Royal Palace", ar: "القصر الملكي" },
    summary: {
      en: "Native iOS marketplace for luxury collectibles: catalog, listings, favorites, in-app chat and phone auth, backed by Supabase and Edge Functions.",
      ar: "تطبيق iOS لبيع وشراء المقتنيات الفاخرة: كتالوج، إعلانات، مفضلة، شات داخل التطبيق وتسجيل برقم الموبايل، والباك إند على Supabase وEdge Functions.",
    },
    badge: { en: "Client · Aser Watch", ar: "عميل · Aser Watch" },
    stack: ["Swift", "SwiftUI", "Supabase", "TypeScript"],
    privateCode: true,
    cover: "from-amber-500 to-rose-500",
  },
  {
    slug: "mrc",
    title: { en: "MRC: Deals & Treasury System", ar: "MRC: نظام الصفقات والخزنة" },
    summary: {
      en: "Internal management system for a watch business: deals, employees and owners, salary advances and bonuses, daily and monthly treasury closing, and company WhatsApp numbers.",
      ar: "نظام إدارة داخلي لبيزنس ساعات: الصفقات، الموظفين والأونرز، السلف والبونص، تقفيل الخزنة اليومي والشهري، وأرقام واتساب الشركة.",
    },
    badge: { en: "Client · Aser Watch", ar: "عميل · Aser Watch" },
    stack: ["JavaScript", "Tailwind", "Supabase", "PostgreSQL"],
    live: "https://mrc-umber-xi.vercel.app",
    github: `${GH}/MRC`,
    cover: "from-yellow-500 to-amber-700",
  },
  {
    slug: "icpc-orientation",
    title: { en: "ICPC × ECU Orientation Challenge", ar: "تحدي ICPC × ECU للـ Orientation" },
    summary: {
      en: "Mobile web game for the ICPC booth: students scan a QR code, beat three timed puzzles, and land on a live multi-wave leaderboard with an admin panel and CSV export.",
      ar: "لعبة ويب للموبايل في بوث ICPC: الطالب يعمل scan للـ QR، يحل 3 ألغاز بتايمر، ويظهر على leaderboard لايف بأكتر من wave، ومعاها لوحة أدمن وتصدير CSV.",
    },
    role: { en: "Database & backend", ar: "الداتابيز والباك إند" },
    stack: ["JavaScript", "Firebase", "Firestore"],
    live: "https://icpc-website.vercel.app",
    cover: "from-sky-500 to-blue-700",
  },
  {
    slug: "shop-qr",
    title: { en: "Shop QR Payments", ar: "QR الدفع للمحلات" },
    summary: {
      en: "One QR code per shop that opens its payment options (InstaPay, mobile wallets) with scan and click analytics and an owner dashboard.",
      ar: "QR لكل محل بيفتح وسايل الدفع بتاعته (InstaPay والمحافظ)، مع إحصائيات للـ scans والضغطات ولوحة تحكم لصاحب المحل.",
    },
    stack: ["Python", "Flask", "Supabase"],
    live: "https://qr-code-tan-tau.vercel.app",
    github: `${GH}/QR-Code`,
    cover: "from-emerald-500 to-teal-600",
  },
  {
    slug: "eventive",
    title: { en: "Eventive", ar: "Eventive" },
    summary: {
      en: "Event RSVP platform: a guest page to confirm attendance and an admin dashboard to manage responses.",
      ar: "منصة RSVP للإيفنتات: صفحة للضيوف يأكدوا حضورهم ولوحة أدمن لإدارة الردود.",
    },
    stack: ["Python", "Flask", "JavaScript"],
    live: "https://eventive-steel.vercel.app",
    github: `${GH}/Eventive`,
    cover: "from-fuchsia-500 to-purple-700",
  },
];

/** Older projects with no repo or images: shown as a compact list. */
export const earlierProjects: Pick<Project, "slug" | "title" | "summary" | "stack">[] = [
  {
    slug: "smart-home",
    title: { en: "Smart Home with AI & IoT", ar: "بيت ذكي بالـ AI والـ IoT" },
    summary: {
      en: "Raspberry Pi 5 + Arduino R4: face recognition, RFID and fingerprint access, gas/flame/smoke/motion sensors, and an AI voice assistant automated with n8n.",
      ar: "Raspberry Pi 5 وArduino R4: تعرّف على الوجه، دخول بالـ RFID والبصمة، حساسات غاز ولهب ودخان وحركة، ومساعد صوتي بالـ AI متوصل بـ n8n.",
    },
    stack: ["Python", "Raspberry Pi", "Arduino", "n8n", "Supabase"],
  },
  {
    slug: "moneyphi",
    title: { en: "MoneyPhi", ar: "MoneyPhi" },
    summary: {
      en: "AI-powered expense tracker with Gemini predictions, investment suggestions and Chart.js dashboards.",
      ar: "تطبيق لتتبع المصاريف بالـ AI: توقعات بـ Gemini، اقتراحات استثمار، ورسوم بيانية بـ Chart.js.",
    },
    stack: ["JavaScript", "Gemini API", "Chart.js"],
  },
  {
    slug: "crypto-exchange",
    title: { en: "Cryptocurrency Exchange Platform", ar: "منصة تداول عملات رقمية" },
    summary: {
      en: "Web platform for exchanging cryptocurrencies (Oct 2024 to Jan 2025).",
      ar: "منصة ويب لتبادل العملات الرقمية (أكتوبر 2024 لحد يناير 2025).",
    },
    stack: ["Web"],
  },
];
