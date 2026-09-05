import type { ProjectRecord, Sector, ProjectStatus, AoiId } from "../data/types";
import type { Band } from "../assessment/scoringEngine";
import type { DimensionKey } from "../assessment/dimensions";
import type { Provenance } from "../data/provenance";
import { ASSESSMENT_DISCLAIMER } from "../assessment/disclaimer";

/**
 * Bilingual UI (WORK-DEC-4: English UI, Arabic-ready → now Arabic-enabled). English is the default so
 * every component renders correctly WITHOUT a LangProvider (keeps the test suite provider-free and
 * English-exact). Arabic strings drive the RTL exhibition variant. Numerals stay Western (UAE gov norm).
 *
 * NOTE: the Assessment disclaimer is a legally-approved English string (WORK-BR-15). Its Arabic rendering
 * here is a PROVISIONAL translation and must be replaced with a comms/legal-approved Arabic disclaimer
 * before any official use — see `disclaimerNeedsApproval`.
 */
export type Lang = "en" | "ar";
export const LANGS: Lang[] = ["en", "ar"];
export const dirFor = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");
export const isRtl = (lang: Lang) => lang === "ar";

// ── data-value label maps (keyed by the English enum/value used internally) ──
const SECTOR_AR: Record<Sector, string> = {
  Mobility: "التنقل",
  Education: "التعليم",
  Health: "الصحة",
  "Public Realm": "المجال العام",
  "Community Facilities": "المرافق المجتمعية",
  Utilities: "المرافق",
};
const STATUS_AR: Record<ProjectStatus, string> = {
  "Under Delivery": "قيد التنفيذ",
  Planned: "مُخطَّط",
  Completed: "مكتمل",
  Concept: "تصوري",
};
const STRATEGIC_AR: Record<string, string> = {
  "Liveable City": "مدينة صالحة للعيش",
  "Economic Vitality": "الحيوية الاقتصادية",
  Sustainability: "الاستدامة",
  "Community Wellbeing": "رفاهية المجتمع",
};
const LIVEABILITY_AR: Record<string, string> = {
  "Access to Services": "الوصول إلى الخدمات",
  "Green & Public Realm": "المساحات الخضراء والعامة",
  "Mobility & Connectivity": "التنقل والاتصال",
  "Health & Education": "الصحة والتعليم",
};
const BAND_AR: Record<Band, string> = {
  High: "مرتفع",
  Medium: "متوسط",
  Low: "منخفض",
  "Insufficient data": "بيانات غير كافية",
};
const PROVENANCE_AR: Record<Provenance, string> = {
  OFFICIAL_PUBLIC: "رسمي / عام",
  DERIVED: "مشتق",
  SYNTHETIC_DEMO: "بيانات تجريبية",
};
const AOI_AR: Record<AoiId, string> = { khalifa: "مدينة خليفة", reem: "جزيرة الريم" };
const AOI_EN: Record<AoiId, string> = { khalifa: "Khalifa City", reem: "Al Reem Island" };

export const DIM_LABEL: Record<Lang, Record<DimensionKey, string>> = {
  en: {
    communityNeed: "Community Need",
    strategicAlignment: "Strategic Alignment",
    spatialServiceGap: "Spatial Service Gap",
    accessibilityBenefit: "Accessibility Benefit",
    duplication: "Existing Project Duplication",
    infrastructureDependency: "Infrastructure Dependency",
    deliveryComplexity: "Delivery Complexity",
  },
  ar: {
    communityNeed: "الحاجة المجتمعية",
    strategicAlignment: "المواءمة الاستراتيجية",
    spatialServiceGap: "الفجوة المكانية في الخدمات",
    accessibilityBenefit: "منفعة إمكانية الوصول",
    duplication: "ازدواجية المشاريع القائمة",
    infrastructureDependency: "الاعتماد على البنية التحتية",
    deliveryComplexity: "تعقيد التنفيذ",
  },
};

// ── value → label helpers ──
export const sectorLabel = (s: Sector, lang: Lang) => (lang === "ar" ? SECTOR_AR[s] : s);
export const statusLabel = (s: ProjectStatus, lang: Lang) => (lang === "ar" ? STATUS_AR[s] : s);
export const strategicLabel = (v: string, lang: Lang) => (lang === "ar" ? STRATEGIC_AR[v] ?? v : v);
export const liveabilityLabel = (v: string, lang: Lang) => (lang === "ar" ? LIVEABILITY_AR[v] ?? v : v);
export const bandLabel = (b: Band, lang: Lang) => (lang === "ar" ? BAND_AR[b] : b);
export const provenanceLabel = (p: Provenance, lang: Lang) =>
  lang === "ar" ? PROVENANCE_AR[p] : { OFFICIAL_PUBLIC: "Official / Public", DERIVED: "Derived", SYNTHETIC_DEMO: "Synthetic / Demo" }[p];
export const aoiName = (a: AoiId, lang: Lang) => (lang === "ar" ? AOI_AR[a] : AOI_EN[a]);
export const dimLabel = (k: DimensionKey, lang: Lang) => DIM_LABEL[lang][k];

const DIM_KEY_BY_EN = Object.fromEntries(
  (Object.keys(DIM_LABEL.en) as DimensionKey[]).map((k) => [DIM_LABEL.en[k], k])
) as Record<string, DimensionKey>;
/** Translate an English dimension label (as stored in the AI context) to the target language. */
export const localizeDim = (enLabel: string, lang: Lang) => {
  const k = DIM_KEY_BY_EN[enLabel];
  return k ? DIM_LABEL[lang][k] : enLabel;
};

// project display name: Arabic uses the record's own nameAr; English uses nameEn.
export const projectName = (p: ProjectRecord, lang: Lang) => (lang === "ar" ? p.nameAr : p.nameEn);
export function shortName(p: ProjectRecord, lang: Lang): string {
  if (lang === "ar") return p.nameAr; // nameAr is already short (e.g. "مدرسة مجتمعية 1")
  const prefix = p.aoi === "khalifa" ? "Khalifa City " : "Al Reem Island ";
  return p.nameEn.startsWith(prefix) ? p.nameEn.slice(prefix.length) : p.nameEn;
}

// ── lang-aware compact number formatting (Western numerals; localized units) ──
export function fmtAedL(aed: number, lang: Lang): string {
  if (lang === "ar") {
    if (aed >= 1e9) return `${(aed / 1e9).toFixed(1)} مليار درهم`;
    if (aed >= 1e6) return `${(aed / 1e6).toFixed(0)} مليون درهم`;
    return `${aed.toLocaleString("en")} درهم`;
  }
  if (aed >= 1e9) return `AED ${(aed / 1e9).toFixed(1)}B`;
  if (aed >= 1e6) return `AED ${(aed / 1e6).toFixed(0)}M`;
  return `AED ${aed.toLocaleString("en")}`;
}
export function fmtPeopleL(n: number, lang: Lang): string {
  if (n >= 1000) return lang === "ar" ? `~${Math.round(n / 1000)} ألف` : `~${Math.round(n / 1000)}K`;
  return `${n}`;
}
export const numL = (n: number) => n.toLocaleString("en"); // Western numerals in both languages

/** Provisional Arabic disclaimer needs comms/legal approval before official use. */
export const disclaimerNeedsApproval = true;

// ── UI string dictionary ──
export interface Dict {
  brand: string;
  product: string;
  tagline: string;
  hero: { understand: string; evaluate: string; simulate: string; start: string; livex: string };
  nav: { explore: string; projects: string; assessment: string; simulation: string; ask: string };
  explore: {
    sub: string; areas: string; closing: string; simulateCta: string; safeOn: string; safeOff: string;
    fallback: string; degraded: string; projectsPanel: string; selectedLocation: string; viewDetails: string;
    langHint: string;
  };
  kpi: { totalProjects: string; totalInvestment: string; underDelivery: string; planned: string; populationServed: string };
  details: {
    brief: string; selectedLocation: string; abudhabi: string; priority: string; computedBy: string;
    estCapex: string; populationServed: string; timeline: string; deliveryProgress: string;
    strategicTheme: string; liveabilityFocus: string; evaluate: string; simulate: string;
    selectedProject: string; otherProjects: string; locationNote: string; ofScore: string;
    briefTemplate: (sector: string, aoi: string, strat: string, live: string, capex: string, pop: string) => string;
  };
  assess: {
    eyebrow: string; question: string; back: string; simulate: string; overall: string; scoreOf: string;
    computed: string; why: string; drivers: string; constraints: string; higherRisk: string; none: string;
    driverRaises: string; constraintLowers: string; evidence: string; computedTag: string; narrative: string;
    geoContext: (city: string) => string; disclaimer: string; driver: string; constraint: string;
    highRisk: string; moderateRisk: string; lowRisk: string;
  };
  sim: {
    eyebrow: string; question: string; hypo: string; current: string; withProposed: string; back: string;
    cta: string; reset: string; proposedSchool: string; covered: string; underserved: string; proposedLbl: string;
    catchment: string; placeLabel: string; kpiPop: string; kpiCoverage: string; kpiUnderserved: string;
    kpiAccess: string; kpiImpact: string; newlyCovered: string; amberNote: string; figures: string; improved: string;
  };
  ask: { title: string; subtitle: string; close: string; footer: string };
  dash: {
    eyebrow: string; title: (city: string) => string; back: string; bySector: string; byStatus: string;
    projects: string; note: string;
  };
  closing: { l1: string; l2: string; l3: string; back: string };
  aoiSelect: { title: string; photo: string; sub: Record<AoiId, string> };
  fallback: { title: string; intro: string; script: string[]; slot: string; back: string };
  weightsLabel: string;
}

export const T: Record<Lang, Dict> = {
  en: {
    brand: "ADPIC",
    product: "Capital Intelligence",
    tagline: "People · Places · Possibilities",
    hero: { understand: "Understand the place.", evaluate: "Evaluate an investment.", simulate: "Simulate its impact.", start: "Start Experience →", livex: "LIVEX 2026 · Abu Dhabi" },
    nav: { explore: "Explore", projects: "Projects", assessment: "Assessment", simulation: "Simulation", ask: "Ask AI" },
    explore: {
      sub: "Capital Intelligence", areas: "Areas", closing: "Closing", simulateCta: "Simulate liveability impact →",
      safeOn: "● Safe mode", safeOff: "○ Safe mode", fallback: "Fallback",
      degraded: "Live 3D unavailable — showing the deterministic offline scene.",
      projectsPanel: "Projects — select to focus", selectedLocation: "SELECTED · VIEW DETAILS", viewDetails: "View Details →",
      langHint: "English UI · Arabic-ready architecture",
    },
    kpi: { totalProjects: "Total Projects", totalInvestment: "Total Investment", underDelivery: "Under Delivery", planned: "Planned", populationServed: "Population Served" },
    details: {
      brief: "INVESTMENT BRIEF", selectedLocation: "SELECTED LOCATION", abudhabi: "Abu Dhabi", priority: "PRIORITY",
      computedBy: "Computed by GIS indicators + business rules", estCapex: "Est. CAPEX", populationServed: "Population served",
      timeline: "Timeline", deliveryProgress: "Delivery progress", strategicTheme: "Strategic theme", liveabilityFocus: "Liveability focus",
      evaluate: "Evaluate this investment →", simulate: "Simulate liveability impact →",
      selectedProject: "Selected project", otherProjects: "Other portfolio projects", ofScore: "/ 100",
      locationNote: "Location from the frozen validated dataset — not an official ADPIC record.",
      briefTemplate: (sector, aoi, strat, live, capex, pop) =>
        `${sector} investment in ${aoi} advancing the ${strat} agenda, with a liveability focus on ${live}. Estimated ${capex} serving approximately ${pop} residents.`,
    },
    assess: {
      eyebrow: "AI-ASSISTED INVESTMENT ASSESSMENT", question: "Should this project be prioritised?", back: "← Back to project",
      simulate: "Simulate impact →", overall: "OVERALL PRIORITY", scoreOf: "/ 100 priority score",
      computed: "Computed by deterministic GIS indicators + business rules.", why: "Why this result?",
      drivers: "STRONGEST DRIVERS", constraints: "PRINCIPAL CONSTRAINTS", higherRisk: "· higher = greater risk", none: "None material",
      driverRaises: "driver raises priority", constraintLowers: "constraint (risk) lowers it", evidence: "Assessment evidence",
      computedTag: "Computed · GIS indicators + business rules",
      narrative: "NARRATIVE EXPLANATION · generated from the evidence (template, not an approval)",
      geoContext: (city) => `Assessed in geographic context · ${city}, Abu Dhabi · location from the validated dataset`,
      disclaimer: ASSESSMENT_DISCLAIMER,
      driver: "driver", constraint: "constraint", highRisk: "High risk", moderateRisk: "Moderate risk", lowRisk: "Low risk",
    },
    sim: {
      eyebrow: "LIVEABILITY IMPACT SIMULATION · KHALIFA CITY", question: "What changes if we build the school here?",
      hypo: "Hypothetical school (demonstration — not an approved project)", current: "Current", withProposed: "With Proposed School",
      back: "← Back", cta: "Simulate the proposed school →", reset: "↺ Reset", proposedSchool: "Proposed School",
      covered: "Covered community", underserved: "Underserved community", proposedLbl: "Proposed school",
      catchment: "Proposed catchment (translucent walkable area)", placeLabel: "Khalifa City · Abu Dhabi",
      kpiPop: "Population within service area", kpiCoverage: "Coverage", kpiUnderserved: "Underserved population",
      kpiAccess: "Avg access distance", kpiImpact: "Liveability Impact Score",
      newlyCovered: "Newly covered communities: ", amberNote: "Amber communities are outside walkable catchment of an existing school.",
      figures: "Figures computed from the deterministic simulation model on the real Khalifa City road network — approved real context; the school is hypothetical, not an approved project.",
      improved: "improved",
    },
    ask: {
      title: "Ask ADPIC AI",
      subtitle: "Suggested questions — deterministic explanations grounded in the approved demo context (no live LLM).",
      close: "Close",
      footer: "Deterministic explanation from approved demo data — not an official project approval. Works without a live LLM.",
    },
    dash: {
      eyebrow: "PORTFOLIO OVERVIEW", title: (city) => `${city} — Capital Portfolio`, back: "← Back",
      bySector: "Projects by Sector", byStatus: "Projects by Status", projects: "projects",
      note: "Figures computed from the frozen synthetic demonstration portfolio (Synthetic / Demo — not official ADPIC records).",
    },
    closing: { l1: "Smarter Investment.", l2: "Brighter Communities.", l3: "A More Liveable Abu Dhabi.", back: "← Back to Explore" },
    aoiSelect: {
      title: "Select Area of Interest", photo: "photography: owner-supplied asset [REFERENCE NEEDED]",
      sub: { khalifa: "Planning & Liveability Assessment", reem: "3D Visualization & Urban Intelligence" },
    },
    fallback: {
      title: "Deterministic fallback demonstration",
      intro: "Runs with no network and no live LLM — the guaranteed exhibition-recovery path.",
      script: [
        "Understand — Explore the 3D capital landscape (Al Reem opening / Khalifa spine).",
        "Evaluate — Select a Khalifa project → deterministic Low/Medium/High assessment with evidence.",
        "Simulate — Run the hypothetical school → before/after coverage + KPI change.",
        "Close — Smarter investment · brighter communities · a more liveable Abu Dhabi.",
      ],
      slot: "Backup video slot — owner-supplied operational asset, prepared & verified before go-live. [REFERENCE NEEDED]",
      back: "← Back",
    },
    weightsLabel: "Illustrative exhibition-only weights — not an official ADPIC methodology (subject to separate validation).",
  },
  ar: {
    brand: "ADPIC",
    product: "الذكاء الاستثماري للعاصمة",
    tagline: "الناس · الأماكن · الإمكانات",
    hero: { understand: "افهم المكان.", evaluate: "قيّم الاستثمار.", simulate: "حاكِ أثره.", start: "ابدأ التجربة ←", livex: "لايفكس 2026 · أبوظبي" },
    nav: { explore: "استكشاف", projects: "المشاريع", assessment: "التقييم", simulation: "المحاكاة", ask: "اسأل الذكاء" },
    explore: {
      sub: "الذكاء الاستثماري للعاصمة", areas: "المناطق", closing: "الختام", simulateCta: "حاكِ الأثر المعيشي ←",
      safeOn: "● الوضع الآمن", safeOff: "○ الوضع الآمن", fallback: "الوضع الاحتياطي",
      degraded: "العرض ثلاثي الأبعاد المباشر غير متاح — يتم عرض المشهد الحتمي دون اتصال.",
      projectsPanel: "المشاريع — اختر للتركيز", selectedLocation: "محدد · عرض التفاصيل", viewDetails: "عرض التفاصيل ←",
      langHint: "واجهة عربية · بنية جاهزة للغتين",
    },
    kpi: { totalProjects: "إجمالي المشاريع", totalInvestment: "إجمالي الاستثمار", underDelivery: "قيد التنفيذ", planned: "مُخطَّط", populationServed: "عدد المستفيدين" },
    details: {
      brief: "ملخص الاستثمار", selectedLocation: "الموقع المحدد", abudhabi: "أبوظبي", priority: "الأولوية",
      computedBy: "محسوب بمؤشرات نظم المعلومات الجغرافية + قواعد العمل", estCapex: "التكلفة الرأسمالية التقديرية", populationServed: "عدد المستفيدين",
      timeline: "الجدول الزمني", deliveryProgress: "نسبة الإنجاز", strategicTheme: "المحور الاستراتيجي", liveabilityFocus: "محور جودة الحياة",
      evaluate: "قيّم هذا الاستثمار ←", simulate: "حاكِ الأثر المعيشي ←",
      selectedProject: "المشروع المحدد", otherProjects: "مشاريع المحفظة الأخرى", ofScore: "/ 100",
      locationNote: "الموقع من مجموعة البيانات المُثبَّتة والمُتحقَّق منها — ليست سجلاً رسمياً لدائرة التخطيط.",
      briefTemplate: (sector, aoi, strat, live, capex, pop) =>
        `استثمار في قطاع ${sector} بمنطقة ${aoi} يدعم أجندة ${strat}، مع تركيز على جودة الحياة في ${live}. تكلفة تقديرية ${capex} تخدم نحو ${pop} من السكان.`,
    },
    assess: {
      eyebrow: "تقييم استثماري بمساعدة الذكاء الاصطناعي", question: "هل ينبغي منح هذا المشروع الأولوية؟", back: "→ العودة إلى المشروع",
      simulate: "محاكاة الأثر ←", overall: "الأولوية الإجمالية", scoreOf: "/ 100 درجة الأولوية",
      computed: "محسوبة بمؤشرات نظم المعلومات الجغرافية + قواعد العمل الحتمية.", why: "لماذا هذه النتيجة؟",
      drivers: "أقوى العوامل الداعمة", constraints: "أبرز القيود", higherRisk: "· الأعلى = مخاطر أكبر", none: "لا يوجد جوهري",
      driverRaises: "عامل داعم يرفع الأولوية", constraintLowers: "قيد (مخاطرة) يخفض الأولوية", evidence: "أدلة التقييم",
      computedTag: "محسوب · مؤشرات جغرافية + قواعد عمل",
      narrative: "شرح سردي · مُولَّد من الأدلة (قالب، وليس موافقة)",
      geoContext: (city) => `مُقيَّم في السياق الجغرافي · ${city}، أبوظبي · الموقع من مجموعة البيانات المُتحقَّق منها`,
      disclaimer: "تقييم توضيحي لدعم القرار لأغراض العرض فقط؛ وليس موافقة رسمية على المشروع أو قراراً استثمارياً. (ترجمة مبدئية — بانتظار الاعتماد)",
      driver: "عامل داعم", constraint: "قيد", highRisk: "مخاطر مرتفعة", moderateRisk: "مخاطر متوسطة", lowRisk: "مخاطر منخفضة",
    },
    sim: {
      eyebrow: "محاكاة الأثر المعيشي · مدينة خليفة", question: "ما الذي يتغير إذا بنينا المدرسة هنا؟",
      hypo: "مدرسة افتراضية (لأغراض العرض — وليست مشروعاً معتمداً)", current: "الحالي", withProposed: "مع المدرسة المقترحة",
      back: "→ رجوع", cta: "حاكِ المدرسة المقترحة ←", reset: "↺ إعادة", proposedSchool: "مدرسة مقترحة",
      covered: "مجتمع مُغطّى", underserved: "مجتمع ناقص الخدمة", proposedLbl: "مدرسة مقترحة",
      catchment: "نطاق التغطية المقترح (منطقة سير شبه شفافة)", placeLabel: "مدينة خليفة · أبوظبي",
      kpiPop: "السكان ضمن نطاق الخدمة", kpiCoverage: "نسبة التغطية", kpiUnderserved: "السكان ناقصو الخدمة",
      kpiAccess: "متوسط مسافة الوصول", kpiImpact: "مؤشر الأثر المعيشي",
      newlyCovered: "المجتمعات المُغطّاة حديثاً: ", amberNote: "المجتمعات باللون الكهرماني خارج نطاق السير لأي مدرسة قائمة.",
      figures: "أرقام محسوبة من نموذج المحاكاة الحتمي على شبكة طرق مدينة خليفة الحقيقية — سياق حقيقي معتمد؛ المدرسة افتراضية وليست مشروعاً معتمداً.",
      improved: "تحسّن",
    },
    ask: {
      title: "اسأل الذكاء الاصطناعي ADPIC",
      subtitle: "أسئلة مقترحة — تفسيرات حتمية مستندة إلى سياق العرض المعتمد (بدون نموذج لغوي مباشر).",
      close: "إغلاق",
      footer: "تفسير حتمي من بيانات العرض المعتمدة — وليس موافقة رسمية على المشروع. يعمل دون نموذج لغوي مباشر.",
    },
    dash: {
      eyebrow: "نظرة عامة على المحفظة", title: (city) => `${city} — المحفظة الرأسمالية`, back: "→ رجوع",
      bySector: "المشاريع حسب القطاع", byStatus: "المشاريع حسب الحالة", projects: "مشروع",
      note: "أرقام محسوبة من محفظة العرض التجريبية المُثبَّتة (بيانات تجريبية — ليست سجلات رسمية لدائرة التخطيط).",
    },
    closing: { l1: "استثمار أذكى.", l2: "مجتمعات أزهى.", l3: "أبوظبي أكثر ملاءمة للعيش.", back: "→ العودة إلى الاستكشاف" },
    aoiSelect: {
      title: "اختر منطقة الاهتمام", photo: "التصوير: أصل يوفّره المالك [مطلوب مرجع]",
      sub: { khalifa: "التخطيط وتقييم جودة الحياة", reem: "التصور ثلاثي الأبعاد والذكاء العمراني" },
    },
    fallback: {
      title: "عرض احتياطي حتمي",
      intro: "يعمل دون شبكة ودون نموذج لغوي مباشر — مسار التعافي المضمون للعرض.",
      script: [
        "افهم — استكشف المشهد ثلاثي الأبعاد للعاصمة (افتتاح جزيرة الريم / محور مدينة خليفة).",
        "قيّم — اختر مشروعاً في مدينة خليفة ← تقييم حتمي منخفض/متوسط/مرتفع مع الأدلة.",
        "حاكِ — شغّل المدرسة الافتراضية ← التغطية قبل/بعد + تغيّر المؤشرات.",
        "اختم — استثمار أذكى · مجتمعات أزهى · أبوظبي أكثر ملاءمة للعيش.",
      ],
      slot: "خانة الفيديو الاحتياطي — أصل تشغيلي يوفّره المالك، يُجهَّز ويُتحقَّق منه قبل الإطلاق. [مطلوب مرجع]",
      back: "→ رجوع",
    },
    weightsLabel: "أوزان توضيحية لأغراض العرض فقط — ليست منهجية رسمية لدائرة التخطيط (خاضعة لتحقق منفصل).",
  },
};
