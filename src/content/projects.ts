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
  /** Tailwind gradient: card cover when there is no screenshot, and accent on the details page. */
  cover: string;
  /** Screenshot in /public/projects. */
  image?: string;
  details: ProjectDetails;
};

export type ProjectDetails = {
  overview: Localized;
  features: Localized[];
  /** Headline numbers, e.g. research results. */
  highlights?: { label: Localized; value: string; baseline?: Localized }[];
};

const GH = "https://github.com/YoussefAtia17";

export const featuredProjects: Project[] = [
  {
    slug: "ara-fed",
    title: { en: "ARA-Fed", ar: "ARA-Fed" },
    summary: {
      en: "Adaptive, resource-aware federated learning framework. Smarter client scheduling and loss-adaptive aggregation beat FedAvg, FedProx, SCAFFOLD, FedNova and MOON across vision, NLP and audio on 100 simulated clients (CIFAR-10: 71% vs 52% for FedAvg).",
      ar: "إطار Federated Learning بيتكيّف مع موارد الأجهزة. جدولة أذكى للعملاء وتجميع بيتكيّف مع الـ loss، ونتايجه أحسن من FedAvg وFedProx وSCAFFOLD وFedNova وMOON في الصور والنصوص والصوت على 100 عميل.",
    },
    badge: { en: "Research", ar: "بحث" },
    stack: ["Python", "NumPy", "Matplotlib", "Federated Learning"],
    github: `${GH}/ARA-Fed-Simulation`,
    cover: "from-indigo-500 to-cyan-400",
    details: {
      overview: {
        en: "Federated learning trains a shared model without moving private data off users' devices, but slow clients and uneven (non-IID) data hold it back. ARA-Fed tackles both with strategic client scheduling and loss-adaptive aggregation, and was evaluated on 100 simulated clients under Dirichlet (α = 0.5) partitioning against five state-of-the-art baselines. It's the simulation code for the paper “Federated Learning for Privacy-Preserving AI: An Optimized Client-Server Aggregation Protocol”.",
        ar: "الـ Federated Learning بيدرّب موديل مشترك من غير ما الداتا الخاصة تسيب أجهزة المستخدمين، بس الأجهزة البطيئة والداتا المش متوازنة (non-IID) بيأثروا على النتيجة. ARA-Fed بيحل الاتنين بجدولة ذكية للعملاء وتجميع بيتكيّف مع الـ loss، واتجرّب على 100 عميل بتقسيم Dirichlet (α = 0.5) قدام 5 طرق من أحدث الطرق. ده كود المحاكاة للبحث «Federated Learning for Privacy-Preserving AI: An Optimized Client-Server Aggregation Protocol».",
      },
      features: [
        { en: "Strategic client scheduling based on available resources", ar: "جدولة العملاء حسب الموارد المتاحة لكل جهاز" },
        { en: "Loss-adaptive aggregation on the server", ar: "تجميع على السيرفر بيتكيّف مع الـ loss" },
        { en: "Multi-modal evaluation: MNIST, CIFAR-10, AG News, IMDB, Speech Commands, UrbanSound8K", ar: "تقييم على أنواع داتا مختلفة: MNIST وCIFAR-10 وAG News وIMDB وSpeech Commands وUrbanSound8K" },
        { en: "Benchmarked against FedAvg, FedProx, SCAFFOLD, FedNova and MOON", ar: "مقارنة مع FedAvg وFedProx وSCAFFOLD وFedNova وMOON" },
      ],
      highlights: [
        { label: { en: "CIFAR-10 accuracy", ar: "دقة CIFAR-10" }, value: "71.05%", baseline: { en: "FedAvg 51.82%", ar: "FedAvg ‏51.82%" } },
        { label: { en: "AG News accuracy", ar: "دقة AG News" }, value: "88.94%", baseline: { en: "FedAvg 62.23%", ar: "FedAvg ‏62.23%" } },
        { label: { en: "Speech Commands accuracy", ar: "دقة Speech Commands" }, value: "92.78%", baseline: { en: "FedAvg 53.54%", ar: "FedAvg ‏53.54%" } },
      ],
    },
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
    details: {
      overview: {
        en: "A native iOS marketplace built for Aser Watch, a Swiss-watch business, where collectors browse, list and discuss luxury pieces. The app runs on SwiftUI with Supabase handling auth, database and server logic.",
        ar: "تطبيق iOS اتعمل لـ Aser Watch، بيزنس متخصص في الساعات السويسرية، بيخلّي هواة الاقتناء يتصفحوا ويعرضوا ويتكلموا عن القطع الفاخرة. التطبيق مبني بـ SwiftUI، وSupabase مسؤول عن تسجيل الدخول والداتابيز ومنطق السيرفر.",
      },
      features: [
        { en: "Catalog and product detail screens", ar: "كتالوج وصفحة تفاصيل لكل منتج" },
        { en: "Users can add and manage their own listings", ar: "المستخدم يقدر يضيف إعلاناته ويديرها" },
        { en: "Favorites, inbox and in-app chat", ar: "مفضلة وصندوق رسائل وشات داخل التطبيق" },
        { en: "Phone-number sign-in and profiles", ar: "تسجيل برقم الموبايل وبروفايل للمستخدم" },
        { en: "Supabase migrations and Edge Functions (TypeScript) on the backend", ar: "Supabase migrations وEdge Functions بـ TypeScript في الباك إند" },
      ],
    },
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
    github: `${GH}/MRC`,
    cover: "from-yellow-500 to-amber-700",
    image: "/projects/mrc.jpg",
    details: {
      overview: {
        en: "An Arabic-first internal system for Aser Watch to run deals, staff and cash in one place. Owners and employees sign in to track every deal, manage payroll and close the treasury daily and monthly.",
        ar: "نظام داخلي بالعربي لـ Aser Watch بيجمع الصفقات والموظفين والفلوس في مكان واحد. الأونرز والموظفين بيسجلوا دخول يتابعوا كل صفقة، ويديروا المرتبات، ويقفلوا الخزنة يوميًا وشهريًا.",
      },
      features: [
        { en: "Deal tracking for Swiss watch brands with WhatsApp message preview", ar: "متابعة صفقات الساعات السويسرية مع معاينة رسالة الواتساب" },
        { en: "Owners and employees management, instant salary advances and bonuses", ar: "إدارة الأونرز والموظفين، والسلف الفورية والبونص" },
        { en: "Treasury with daily and monthly closing", ar: "خزنة بتقفيل يومي وشهري" },
        { en: "Company WhatsApp numbers management", ar: "إدارة أرقام واتساب الشركة" },
        { en: "Login and profiles, image compression and local-time handling", ar: "تسجيل دخول وبروفايل، ضغط الصور، وظبط التوقيت المحلي" },
      ],
    },
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
    image: "/projects/icpc-orientation.jpg",
    details: {
      overview: {
        en: "Built for the ICPC ECU booth at Orientation 2026. Students scan a QR code, enter their name and race a timer through three puzzles; finishing submits their score to a live leaderboard and shows a code to verify at the booth. I worked on the database and backend.",
        ar: "اتعمل لبوث ICPC ECU في Orientation 2026. الطالب يعمل scan للـ QR، يكتب اسمه، ويحل 3 ألغاز ضد التايمر، ولما يخلّص السكور بيتبعت للـ leaderboard لايف ويظهرله كود يتأكد بيه في البوث. أنا اشتغلت على الداتابيز والباك إند.",
      },
      features: [
        { en: "Three games: Byte Riddle, The Maze (14×14) and Crack The Code", ar: "3 ألعاب: Byte Riddle وThe Maze (‏14×14) وCrack The Code" },
        { en: "Live multi-wave leaderboard with a top-3 podium", ar: "Leaderboard لايف بأكتر من wave ومنصة لأول 3" },
        { en: "Admin panel: start waves, manual scores, prize labels, CSV export, reset", ar: "لوحة أدمن: بدء wave جديدة، إدخال سكور يدوي، الجوايز، تصدير CSV، ومسح الداتا" },
        { en: "Firestore real-time sync across booth devices with an offline fallback", ar: "مزامنة لحظية بـ Firestore بين أجهزة البوث، وبيشتغل أوفلاين لو النت فصل" },
      ],
    },
  },
  {
    slug: "shop-qr",
    title: { en: "Shop QR Payments", ar: "QR الدفع للمحلات" },
    summary: {
      en: "One QR code per shop that opens its payment options (InstaPay, mobile wallets) with scan and click analytics and an owner dashboard.",
      ar: "QR لكل محل بيفتح وسايل الدفع بتاعته (InstaPay والمحافظ)، مع إحصائيات للـ scans والضغطات ولوحة تحكم لصاحب المحل.",
    },
    stack: ["Python", "Flask", "Supabase"],
    live: "https://qr-code-tan-tau.vercel.app/login",
    github: `${GH}/QR-Code`,
    cover: "from-emerald-500 to-teal-600",
    image: "/projects/shop-qr.jpg",
    details: {
      overview: {
        en: "Shops print a single QR code; customers scan it and see every way to pay that shop (InstaPay, Vodafone Cash, Etisalat Cash and more) in one page. Owners log in to manage their wallets and see how many people scanned and tapped.",
        ar: "المحل بيطبع QR واحد، والزبون يعمل scan ويشوف كل طرق الدفع للمحل ده (InstaPay وفودافون كاش واتصالات كاش وغيرهم) في صفحة واحدة. صاحب المحل بيسجل دخول يدير المحافظ بتاعته ويشوف عدد الـ scans والضغطات.",
      },
      features: [
        { en: "Public page per shop at /shop/<slug>", ar: "صفحة عامة لكل محل على ‎/shop/<slug>‎" },
        { en: "Scan and click analytics stored in Supabase", ar: "إحصائيات الـ scans والضغطات متخزنة في Supabase" },
        { en: "Owner dashboard to add and remove wallets", ar: "لوحة تحكم لصاحب المحل يضيف ويمسح المحافظ" },
        { en: "Session-based login, deployed on Vercel", ar: "تسجيل دخول بالـ sessions، ومنشور على Vercel" },
      ],
    },
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
    image: "/projects/eventive.jpg",
    details: {
      overview: {
        en: "A premium-feel RSVP platform: guests browse curated events and confirm attendance, while organizers manage events and responses from an admin page. Frontend and Flask backend are cleanly separated.",
        ar: "منصة RSVP بشكل فخم: الضيوف يتصفحوا الإيفنتات ويأكدوا حضورهم، والمنظمين يديروا الإيفنتات والردود من صفحة الأدمن. الفرونت إند منفصل بشكل واضح عن الباك إند المعمول بـ Flask.",
      },
      features: [
        { en: "Animated hero with video background and light/dark theme", ar: "واجهة متحركة بخلفية فيديو ووضع فاتح وغامق" },
        { en: "Guest sign-up, login and RSVP flow", ar: "تسجيل وتسجيل دخول للضيوف وتأكيد الحضور" },
        { en: "Admin page to manage events and responses", ar: "صفحة أدمن لإدارة الإيفنتات والردود" },
        { en: "Flask API backend, deployed on Vercel", ar: "API بـ Flask، ومنشور على Vercel" },
      ],
    },
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
