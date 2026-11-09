import type { Localized } from "./types";

export const contact = {
  email: "youssefatiav@gmail.com",
  github: "https://github.com/YoussefAtia17",
  cv: "/Resume.pdf",
};

export const bio: Localized = {
  en: "I'm Youssef, a Computer Science student at the Egyptian Chinese University. I build end-to-end products: business systems for real clients, native iOS apps, event platforms, and AI-powered mobile apps. I've also worked part-time as a programming teaching assistant at iSchool.",
  ar: "أنا يوسف، طالب علوم حاسب في الجامعة المصرية الصينية. ببني منتجات كاملة من أولها لآخرها: أنظمة إدارة لعملاء حقيقيين، تطبيقات iOS، منصات للإيفنتات، وتطبيقات موبايل بالذكاء الاصطناعي. واشتغلت بدوام جزئي مساعد مدرّس برمجة في iSchool.",
};

export const skillGroups: { title: Localized; items: string[] }[] = [
  { title: { en: "Languages", ar: "لغات البرمجة" }, items: ["Python", "JavaScript", "TypeScript", "Swift", "C++", "SQL", "Dart"] },
  { title: { en: "Web & Mobile", ar: "ويب وموبايل" }, items: ["HTML", "CSS", "Tailwind", "Flask", "FastAPI", "SwiftUI", "Flutter"] },
  { title: { en: "Data & Backend", ar: "داتا وباك إند" }, items: ["Supabase", "PostgreSQL", "MySQL", "Firebase"] },
  { title: { en: "AI & Automation", ar: "AI وأتمتة" }, items: ["NumPy", "Gemini API", "Ollama", "n8n"] },
  { title: { en: "Tools & Hardware", ar: "أدوات وهاردوير" }, items: ["Git", "Docker", "Vercel", "Raspberry Pi", "Arduino"] },
];

export type TimelineItem = { title: Localized; place: Localized; date: Localized; text?: Localized };

export const experience: TimelineItem[] = [
  {
    title: { en: "Programming Teaching Assistant", ar: "مساعد مدرّس برمجة" },
    place: { en: "iSchool · Part-time", ar: "iSchool · دوام جزئي" },
    date: { en: "Jul 2026", ar: "يوليو 2026" },
    text: {
      en: "Supported instructors in programming classes and helped students debug and finish their projects.",
      ar: "ساعدت المدرّسين في حصص البرمجة وساعدت الطلاب يصلّحوا الأخطاء ويخلّصوا مشاريعهم.",
    },
  },
  {
    title: { en: "Event Organizer: GIS Event", ar: "منظّم فعالية GIS" },
    place: { en: "Egyptian Chinese University", ar: "الجامعة المصرية الصينية" },
    date: { en: "Mar 2024", ar: "مارس 2024" },
    text: {
      en: "Helped organize and coordinate a Geographic Information Systems event.",
      ar: "شاركت في تنظيم وتنسيق فعالية عن نظم المعلومات الجغرافية.",
    },
  },
  {
    title: { en: "Member: Programming & Tech Community", ar: "عضو في مجتمع البرمجة والتكنولوجيا" },
    place: { en: "Egyptian Chinese University", ar: "الجامعة المصرية الصينية" },
    date: { en: "Ongoing", ar: "مستمر" },
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
