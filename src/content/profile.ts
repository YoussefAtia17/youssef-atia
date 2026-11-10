import type { Localized } from "./types";

export const contact = {
  email: "youssefatiav@gmail.com",
  github: "https://github.com/YoussefAtia17",
  cv: "/Resume.pdf",
  /** International format, digits only (e.g. 2010xxxxxxxx). Leave empty to hide the WhatsApp buttons. */
  whatsapp: "201098504605",
};

export const whatsappUrl = contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : null;

/** Big opening line of the About section. The middle part is highlighted. */
export const lead: { en: [string, string, string]; ar: [string, string, string] } = {
  en: ["I'm Youssef, a full-stack developer who ", "turns ideas into working products", ", from the database to the app in your hand."],
  ar: ["أنا يوسف، مطوّر Full-stack ", "بحوّل الفكرة لمنتج شغّال", "، من الداتابيز لحد الأبلكيشن اللي في إيدك."],
};

export const bio: Localized = {
  en: "I work across the whole stack: I design the database, build secure backends and APIs, and ship native iOS, mobile and web apps on top of them. I can own a product end to end, pick up a new tool fast, and add AI where it actually saves time. I care about clean code, fast interfaces, and apps that work just as well in Arabic as in English.",
  ar: "بشتغل على الـ stack كله: بصمّم الداتابيز، وببني باك إند و APIs آمنة، وفوقهم تطبيقات iOS وموبايل وويب. أقدر أمسك المنتج من أوله لآخره، وأتعلم أي أداة جديدة بسرعة، وأضيف AI في المكان اللي فعلًا بيوفّر وقت. بهتم بالكود النضيف، والواجهات السريعة، وإن التطبيق يشتغل بالعربي زي الإنجليزي بالظبط.",
};

/** What I bring, in three lines. */
export const pillars: { key: "backend" | "mobile" | "ai"; title: Localized; text: Localized }[] = [
  {
    key: "backend",
    title: { en: "Backend & data", ar: "باك إند وداتا" },
    text: {
      en: "I design Postgres databases, auth and APIs that stay secure and fast once real users arrive.",
      ar: "بصمّم داتابيز Postgres، وأنظمة تسجيل دخول وصلاحيات، و APIs تفضل آمنة وسريعة لما المستخدمين الحقيقيين يدخلوا.",
    },
  },
  {
    key: "mobile",
    title: { en: "iOS & mobile", ar: "iOS وموبايل" },
    text: {
      en: "I build native SwiftUI and Flutter apps with smooth interfaces in Arabic and English.",
      ar: "ببني تطبيقات SwiftUI و Flutter بواجهات سلسة بالعربي والإنجليزي.",
    },
  },
  {
    key: "ai",
    title: { en: "AI & automation", ar: "AI وأتمتة" },
    text: {
      en: "I connect Gemini, OCR and n8n to automate the boring manual work.",
      ar: "بربط Gemini و n8n وقراءة الصور بالـ AI عشان أشيل الشغل اليدوي الممل.",
    },
  },
];

export const skillGroups: { title: Localized; items: string[] }[] = [
  { title: { en: "Languages", ar: "لغات البرمجة" }, items: ["Python", "JavaScript", "TypeScript", "Swift", "C++", "SQL", "Dart"] },
  { title: { en: "Web & Mobile", ar: "ويب وموبايل" }, items: ["HTML", "CSS", "Tailwind", "Flask", "FastAPI", "SwiftUI", "Flutter"] },
  { title: { en: "Data & Backend", ar: "داتا وباك إند" }, items: ["Supabase", "PostgreSQL", "MySQL", "Firebase"] },
  { title: { en: "AI & Automation", ar: "AI وأتمتة" }, items: ["NumPy", "Gemini API", "Ollama", "n8n"] },
  { title: { en: "Tools & Hardware", ar: "أدوات وهاردوير" }, items: ["Git", "Docker", "Vercel", "Raspberry Pi", "Arduino"] },
];

export type TimelineItem = {
  title: Localized;
  place: Localized;
  date: Localized;
  text?: Localized;
  points?: Localized[];
  tags?: string[];
};

export const experience: TimelineItem[] = [
  {
    title: { en: "Freelance Software Engineer", ar: "Software Engineer فريلانس" },
    place: { en: "Self-employed · Cairo", ar: "شغل حر · القاهرة" },
    date: { en: "Sep 2026 – Present", ar: "سبتمبر 2026 – لحد دلوقتي" },
    text: {
      en: "Three systems for two paying clients, each one designed, built and shipped end-to-end on my own.",
      ar: "3 سيستمات لعميلين بيدفعوا، كل واحد صمّمته وبنيته وسلّمته من أوله لآخره لوحدي.",
    },
    points: [
      {
        en: "MRC (Aser Watch): the deals and treasury back-office the client's staff uses every day, with WhatsApp reminders, payroll and a locked daily/monthly closing.",
        ar: "MRC (Aser Watch): سيستم الصفقات والخزنة اللي فريق العميل بيشتغل عليه كل يوم، بتذكيرات واتساب ومرتبات وقفل يومي وشهري للخزنة.",
      },
      {
        en: "Royal Palace (Aser Watch): a native iOS marketplace for pre-owned Swiss watches with real-time chat, price offers, row-level security and push notifications.",
        ar: "Royal Palace (Aser Watch): ماركت بليس iOS للساعات السويسري المستعملة، فيه شات لايف وعروض أسعار و row-level security وإشعارات push.",
      },
      {
        en: "PlayZone (PlayStation café): a POS with live per-device timers, hourly billing, stock tracking and daily/monthly profit reports.",
        ar: "PlayZone (كافيه بلايستيشن): سيستم كاشير بتايمر لايف لكل جهاز، وحساب بالساعة، ومخزون، وتقارير أرباح يومية وشهرية.",
      },
    ],
    tags: ["Supabase", "PostgreSQL", "SwiftUI", "TypeScript", "JavaScript", "Tailwind"],
  },
  {
    title: { en: "Assistant Tutor", ar: "Assistant Tutor" },
    place: { en: "iSchool · 2-week placement", ar: "iSchool · تدريب أسبوعين" },
    date: { en: "Jul 2026", ar: "يوليو 2026" },
    text: {
      en: "Ran hands-on coding practice with students and helped them get unstuck on their projects.",
      ar: "كنت بدير تدريب عملي على البرمجة مع الطلاب وبساعدهم لما يقفوا في مشاريعهم.",
    },
  },
  {
    title: { en: "Head of Technical", ar: "Head of Technical" },
    place: { en: "ICPC Community", ar: "مجتمع ICPC" },
    date: { en: "Oct 2025 – Present", ar: "أكتوبر 2025 – لحد دلوقتي" },
    text: {
      en: "Lead the technical side of the community: I teach problem-solving sessions on algorithms and data structures and follow up one-on-one with members on problems they get stuck on.",
      ar: "مسؤول عن الجانب التقني في المجتمع: بشرح سيشنز problem solving في الخوارزميات و data structures، وبتابع مع الأعضاء واحد واحد في المسائل اللي بيقفوا فيها.",
    },
    tags: ["Algorithms", "Data Structures", "C++", "Mentoring"],
  },
];

export const education: TimelineItem = {
  title: { en: "B.Sc. Computer Science", ar: "بكالوريوس علوم الحاسب" },
  place: { en: "Egyptian Chinese University (ECU)", ar: "الجامعة المصرية الصينية (ECU)" },
  date: { en: "Expected 2028", ar: "التخرج المتوقع 2028" },
};

export const certifications: { name: string; issuer: string }[] = [
  { name: "Data Preparation in Excel", issuer: "DataCamp" },
  { name: "Data Management and Analysis", issuer: "Huawei" },
  { name: "Marketing", issuer: "HP LIFE" },
  { name: "OOP & Data Structures", issuer: "Programming Advices" },
];
