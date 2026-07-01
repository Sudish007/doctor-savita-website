"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { calculateTreatmentCost, CostEstimate } from "@/lib/utils/cost-calculator";

/**
 * Treatment Cost Estimator section.
 * - Pricing cards in a responsive grid (2 cols tablet, 3 cols desktop)
 * - Interactive cost calculator with consultation type & duration toggles
 * - Breakdown display: initial + follow-ups + kits = total
 * - "This is an estimate" disclaimer
 * - Hindi/English bilingual labels
 * - Glassmorphism card styling
 * - Framer Motion entrance animations
 *
 * Requirements: 33.1, 33.2, 33.3, 33.4, 33.6
 */

type Language = "en" | "hi";
type ConsultationType = "in-person" | "online";
type DurationMonths = 1 | 3 | 6;

// --- i18n Labels ---

const labels: Record<Language, {
  sectionTitle: string;
  sectionSubtitle: string;
  initialConsultation: string;
  followUpVisit: string;
  monthlyRemedyKit: string;
  onlineConsultation: string;
  videoConsultation: string;
  inPerson: string;
  online: string;
  duration: string;
  perVisit: string;
  perMonth: string;
  includes: string;
  calculatorTitle: string;
  consultationType: string;
  treatmentDuration: string;
  month: string;
  months: string;
  costBreakdown: string;
  initialFee: string;
  followUpFees: string;
  monthlyKits: string;
  totalEstimate: string;
  disclaimer: string;
  detailedConsultation: string;
  prescriptionReview: string;
  remedySelection: string;
  progressCheck: string;
  dosageAdjustment: string;
  monthlyRemedy: string;
  dosageGuide: string;
  videoCall30: string;
  chatFollowUp: string;
  videoCall20: string;
  quickQuery: string;
}> = {
  en: {
    sectionTitle: "Treatment Costs",
    sectionSubtitle: "Transparent pricing for all consultation types. Use the calculator to estimate your treatment plan costs.",
    initialConsultation: "Initial Consultation",
    followUpVisit: "Follow-up Visit",
    monthlyRemedyKit: "Monthly Remedy Kit",
    onlineConsultation: "Online Consultation",
    videoConsultation: "Video Consultation",
    whatsappQuery: "WhatsApp Query",
    inPerson: "In-Person",
    online: "Online",
    duration: "45-60 min",
    perVisit: "per visit",
    perMonth: "per month",
    includes: "Includes",
    calculatorTitle: "Cost Calculator",
    consultationType: "Consultation Type",
    treatmentDuration: "Treatment Duration",
    month: "month",
    months: "months",
    costBreakdown: "Cost Breakdown",
    initialFee: "Initial Consultation",
    followUpFees: "Follow-up Visits",
    monthlyKits: "Monthly Remedy Kits",
    totalEstimate: "Total Estimate",
    disclaimer: "This is an estimate for private consultations. Treatment at PHC Khujhwa (govt. clinic) is FREE for all patients.",
    detailedConsultation: "Detailed case-taking",
    prescriptionReview: "Prescription & review",
    remedySelection: "Remedy selection",
    progressCheck: "Progress check",
    dosageAdjustment: "Dosage adjustment",
    monthlyRemedy: "Monthly remedy supply",
    dosageGuide: "Dosage guide included",
    videoCall30: "30-min video call",
    chatFollowUp: "Chat follow-up",
    videoCall20: "20-min video call",
    quickQuery: "Quick query resolution",
  },
  hi: {
    sectionTitle: "उपचार शुल्क",
    sectionSubtitle: "सभी परामर्श प्रकारों के लिए पारदर्शी मूल्य। अपनी उपचार योजना की लागत का अनुमान लगाने के लिए कैलकुलेटर का उपयोग करें।",
    initialConsultation: "प्रथम परामर्श",
    followUpVisit: "फॉलो-अप विज़िट",
    monthlyRemedyKit: "मासिक दवा किट",
    onlineConsultation: "ऑनलाइन परामर्श",
    videoConsultation: "वीडियो परामर्श",
    whatsappQuery: "व्हाट्सएप प्रश्न",
    inPerson: "व्यक्तिगत",
    online: "ऑनलाइन",
    duration: "45-60 मिनट",
    perVisit: "प्रति विज़िट",
    perMonth: "प्रति माह",
    includes: "शामिल है",
    calculatorTitle: "लागत कैलकुलेटर",
    consultationType: "परामर्श प्रकार",
    treatmentDuration: "उपचार अवधि",
    month: "माह",
    months: "माह",
    costBreakdown: "लागत विवरण",
    initialFee: "प्रथम परामर्श",
    followUpFees: "फॉलो-अप विज़िट",
    monthlyKits: "मासिक दवा किट",
    totalEstimate: "कुल अनुमान",
    disclaimer: "यह प्राइवेट परामर्श का अनुमान है। PHC खुजवा (सरकारी क्लिनिक) में सभी मरीज़ों का इलाज मुफ्त है।",
    detailedConsultation: "विस्तृत केस-टेकिंग",
    prescriptionReview: "प्रिस्क्रिप्शन और समीक्षा",
    remedySelection: "दवा चयन",
    progressCheck: "प्रगति जांच",
    dosageAdjustment: "खुराक समायोजन",
    monthlyRemedy: "मासिक दवा आपूर्ति",
    dosageGuide: "खुराक गाइड शामिल",
    videoCall30: "30-मिनट वीडियो कॉल",
    chatFollowUp: "चैट फॉलो-अप",
    videoCall20: "20-मिनट वीडियो कॉल",
    quickQuery: "त्वरित प्रश्न समाधान",
  },
};

// --- Pricing Card Data ---

interface PricingCard {
  id: string;
  nameKey: keyof typeof labels.en;
  priceInPerson?: number;
  priceOnline?: number;
  price?: number;
  durationText: string;
  durationTextHi: string;
  includesKeys: (keyof typeof labels.en)[];
}

const PRICING_CARDS: PricingCard[] = [
  {
    id: "initial",
    nameKey: "initialConsultation",
    priceInPerson: 300,
    priceOnline: 200,
    durationText: "45-60 min",
    durationTextHi: "45-60 मिनट",
    includesKeys: ["detailedConsultation", "prescriptionReview", "remedySelection"],
  },
  {
    id: "followup",
    nameKey: "followUpVisit",
    priceInPerson: 100,
    priceOnline: 100,
    durationText: "20-30 min",
    durationTextHi: "20-30 मिनट",
    includesKeys: ["progressCheck", "dosageAdjustment"],
  },
  {
    id: "monthly-kit",
    nameKey: "monthlyRemedyKit",
    price: 500,
    durationText: "Monthly supply",
    durationTextHi: "मासिक आपूर्ति",
    includesKeys: ["monthlyRemedy", "dosageGuide"],
  },
  {
    id: "online",
    nameKey: "onlineConsultation",
    price: 200,
    durationText: "30 min",
    durationTextHi: "30 मिनट",
    includesKeys: ["videoCall30", "chatFollowUp"],
  },
  {
    id: "video",
    nameKey: "videoConsultation",
    price: 150,
    durationText: "20 min",
    durationTextHi: "20 मिनट",
    includesKeys: ["videoCall20", "quickQuery"],
  },
  {
    id: "whatsapp-query",
    nameKey: "whatsappQuery",
    price: 50,
    durationText: "Text-based",
    durationTextHi: "टेक्स्ट आधारित",
    includesKeys: ["quickQuery", "chatFollowUp"],
  },
];

// --- Icons ---

const RupeeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13l8.5 8" />
    <path d="M6 13h3c4.5 0 4.5-5 0-5H6" />
  </svg>
);

const CalculatorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10.01" />
    <line x1="12" y1="10" x2="12" y2="10.01" />
    <line x1="16" y1="10" x2="16" y2="10.01" />
    <line x1="8" y1="14" x2="8" y2="14.01" />
    <line x1="12" y1="14" x2="12" y2="14.01" />
    <line x1="16" y1="14" x2="16" y2="14.01" />
    <line x1="8" y1="18" x2="8" y2="18.01" />
    <line x1="12" y1="18" x2="16" y2="18" />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// --- Component ---

export function CostEstimator() {
  const [lang, setLang] = useState<Language>("en");
  const [consultationType, setConsultationType] = useState<ConsultationType>("in-person");
  const [duration, setDuration] = useState<DurationMonths>(3);
  const prefersReducedMotion = useReducedMotion();

  const t = labels[lang];
  const estimate: CostEstimate = calculateTreatmentCost(consultationType, duration);

  const followUpCount = duration - 1;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : i * 0.08,
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      id="pricing"
      className="section-padding nature-overlay"
      aria-labelledby="pricing-heading"
    >
      <div className="container-content">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2
              id="pricing-heading"
              className="text-fluid-h2 text-foreground"
            >
              {t.sectionTitle}
            </h2>
          </div>
          <p className="text-foreground-secondary max-w-2xl mx-auto text-fluid-body">
            {t.sectionSubtitle}
          </p>

          {/* Language Toggle */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${
                lang === "en"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground-muted hover:text-foreground hover:bg-muted"
              }`}
              aria-pressed={lang === "en"}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${
                lang === "hi"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground-muted hover:text-foreground hover:bg-muted"
              }`}
              aria-pressed={lang === "hi"}
            >
              हिंदी
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {PRICING_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              className="glass-card p-5 md:p-6 rounded-2xl flex flex-col hover:shadow-elevation-3 transition-shadow duration-200 hover:border-primary/40"
            >
              {/* Service Name */}
              <h3 className="text-fluid-h5 text-foreground mb-2">
                {t[card.nameKey]}
              </h3>

              {/* Price */}
              <div className="mb-3">
                {card.priceInPerson && card.priceOnline ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ₹{card.priceInPerson}
                      </span>
                      <span className="text-xs text-foreground-muted px-2 py-0.5 rounded-full bg-primary-light">
                        {t.inPerson}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-accent">
                        ₹{card.priceOnline}
                      </span>
                      <span className="text-xs text-foreground-muted px-2 py-0.5 rounded-full bg-accent-light">
                        {t.online}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    ₹{card.price}
                  </span>
                )}
              </div>

              {/* Duration */}
              <p className="text-foreground-muted text-fluid-caption mb-3">
                {lang === "en" ? card.durationText : card.durationTextHi} · {card.price ? t.perMonth : t.perVisit}
              </p>

              {/* What's Included */}
              <div className="mt-auto pt-3 border-t border-border-light">
                <p className="text-xs font-medium text-foreground-secondary mb-2">
                  {t.includes}:
                </p>
                <ul className="space-y-1.5">
                  {card.includesKeys.map((key) => (
                    <li
                      key={key}
                      className="flex items-center gap-2 text-fluid-caption text-foreground-muted"
                    >
                      <span className="text-accent flex-shrink-0">
                        <CheckIcon />
                      </span>
                      {t[key]}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cost Calculator */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 md:p-8 rounded-2xl"
        >
          {/* Calculator Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-primary">
              <CalculatorIcon />
            </span>
            <h3 className="text-fluid-h4 text-foreground">
              {t.calculatorTitle}
            </h3>
          </div>

          {/* Consultation Type Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground-secondary mb-2">
              {t.consultationType}
            </label>
            <div className="flex rounded-lg overflow-hidden border border-border">
              <button
                onClick={() => setConsultationType("in-person")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 touch-target ${
                  consultationType === "in-person"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background-secondary text-foreground-muted hover:text-foreground hover:bg-muted"
                }`}
                aria-pressed={consultationType === "in-person"}
              >
                {t.inPerson}
              </button>
              <button
                onClick={() => setConsultationType("online")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 touch-target ${
                  consultationType === "online"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background-secondary text-foreground-muted hover:text-foreground hover:bg-muted"
                }`}
                aria-pressed={consultationType === "online"}
              >
                {t.online}
              </button>
            </div>
          </div>

          {/* Duration Toggle */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-foreground-secondary mb-2">
              {t.treatmentDuration}
            </label>
            <div className="flex rounded-lg overflow-hidden border border-border">
              {([1, 3, 6] as DurationMonths[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 touch-target ${
                    duration === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-background-secondary text-foreground-muted hover:text-foreground hover:bg-muted"
                  }`}
                  aria-pressed={duration === d}
                >
                  {d} {d === 1 ? t.month : t.months}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="border-t border-border-light pt-6">
            <h4 className="text-sm font-medium text-foreground-secondary mb-4">
              {t.costBreakdown}
            </h4>

            <div className="space-y-3">
              {/* Initial Fee */}
              <div className="flex items-center justify-between">
                <span className="text-fluid-body-sm text-foreground-muted">
                  {t.initialFee} (×1)
                </span>
                <span className="text-fluid-body-sm font-medium text-foreground">
                  ₹{estimate.initialFee}
                </span>
              </div>

              {/* Follow-up Fees */}
              <div className="flex items-center justify-between">
                <span className="text-fluid-body-sm text-foreground-muted">
                  {t.followUpFees} (×{followUpCount})
                </span>
                <span className="text-fluid-body-sm font-medium text-foreground">
                  ₹{estimate.followUpFee * followUpCount}
                </span>
              </div>

              {/* Monthly Kits */}
              <div className="flex items-center justify-between">
                <span className="text-fluid-body-sm text-foreground-muted">
                  {t.monthlyKits} (×{duration})
                </span>
                <span className="text-fluid-body-sm font-medium text-foreground">
                  ₹{estimate.monthlyKitFee * duration}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-border my-2" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-fluid-body font-semibold text-foreground">
                  {t.totalEstimate}
                </span>
                <motion.span
                  key={estimate.total}
                  initial={prefersReducedMotion ? {} : { scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl md:text-2xl font-bold text-primary"
                >
                  ₹{estimate.total.toLocaleString("en-IN")}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-foreground-muted text-fluid-caption flex items-center justify-center gap-2">
            <span className="text-primary flex-shrink-0">
              <InfoIcon />
            </span>
            <span>{t.disclaimer}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
