"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HealthCategory } from "@/types";

/**
 * Case Studies Gallery Page
 *
 * Displays anonymized before-and-after treatment cases in a responsive grid
 * with category filtering, expandable detail views, and glassmorphism styling.
 *
 * Requirements: 35.1, 35.2, 35.3, 35.4, 35.6
 */

// ─── Types ───────────────────────────────────────────────────────────────────

interface CaseStudy {
  id: string;
  condition: string;
  category: HealthCategory;
  duration: string;
  outcomeSummary: string;
  narrative: string;
  treatmentApproach: string;
  timeline: string;
  improvementPercentage: number;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-1",
    condition: "Chronic Eczema",
    category: "skin-care",
    duration: "4 months",
    outcomeSummary:
      "Patient experienced significant reduction in flare-ups and itching. Skin texture improved with consistent homeopathic treatment using Graphites and Sulphur.",
    narrative:
      "A 32-year-old patient presented with chronic eczema on forearms and behind the knees, persisting for over 3 years. Previous treatments provided only temporary relief. The patient reported intense itching worse at night and during winter months.",
    treatmentApproach:
      "Constitutional remedy selection based on detailed case-taking. Started with Graphites 200C for the oozing, cracked skin presentation, followed by Sulphur 30C as an intercurrent remedy. Dietary modifications included reducing dairy and processed foods.",
    timeline:
      "Week 1-2: Initial aggravation (expected). Week 3-4: Itching reduced by 40%. Month 2: New patches stopped appearing. Month 3: Existing patches fading. Month 4: 85% clearance with occasional mild patches only during high-stress periods.",
    improvementPercentage: 85,
  },
  {
    id: "cs-2",
    condition: "Recurrent Childhood Tonsillitis",
    category: "child-care",
    duration: "3 months",
    outcomeSummary:
      "Child's recurrent throat infections reduced from monthly episodes to none in 3 months. Immune resilience improved significantly with Baryta Carb and Calcarea Carb.",
    narrative:
      "A 6-year-old child was brought in with a history of tonsillitis occurring every 3-4 weeks for the past year. Parents were considering surgical removal (tonsillectomy) as a last resort. The child was generally shy, slow to warm up, and prone to catching colds easily.",
    treatmentApproach:
      "Baryta Carb 200C was selected as the constitutional remedy based on the child's overall temperament and physical symptoms. Calcarea Carb 30C was used as a complementary remedy for strengthening immunity. No antibiotics were used during the treatment period.",
    timeline:
      "Week 1-3: One mild episode managed with Hepar Sulph 30C. Week 4-6: No episodes, improved energy. Month 2: Complete absence of infections. Month 3: Child more active, better appetite, no recurrence. Follow-up at 6 months: remained infection-free.",
    improvementPercentage: 95,
  },
  {
    id: "cs-3",
    condition: "PCOS with Irregular Periods",
    category: "womens-health",
    duration: "6 months",
    outcomeSummary:
      "Menstrual cycle regularized from 45-60 day intervals to consistent 30-32 days. Hormonal acne cleared and energy levels markedly improved with Pulsatilla and Sepia.",
    narrative:
      "A 28-year-old woman presented with PCOS diagnosed 2 years prior. Symptoms included irregular periods (gaps of 45-60 days), hormonal acne on jawline and chin, weight gain (8 kg in one year), fatigue, and mild hirsutism. She had been on oral contraceptives previously but stopped due to side effects.",
    treatmentApproach:
      "Pulsatilla 200C was the primary constitutional remedy based on her emotional sensitivity and changeable symptoms. Sepia 30C was added for the hormonal stagnation picture. Lifestyle guidance included 30 minutes daily walking, stress management, and reducing refined carbohydrates.",
    timeline:
      "Month 1: Periods came after 38 days (previously 55+). Month 2: Acne reducing, cycle 35 days. Month 3: Cycle normalized to 32 days, energy improvement. Month 4-5: Consistent 30-32 day cycles, acne cleared by 80%. Month 6: Ultrasound showed reduced ovarian cysts, weight loss of 3 kg.",
    improvementPercentage: 80,
  },
  {
    id: "cs-4",
    condition: "Chronic Acid Reflux (GERD)",
    category: "digestion",
    duration: "2 months",
    outcomeSummary:
      "Complete resolution of daily heartburn and regurgitation. Patient discontinued antacids entirely after 6 weeks of homeopathic treatment with Nux Vomica and Robinia.",
    narrative:
      "A 45-year-old man with 5-year history of GERD, relying on daily PPIs (proton pump inhibitors). Symptoms included burning in chest after meals, sour eructations, bloating, and disturbed sleep due to nocturnal reflux. Lifestyle factors included sedentary desk job, irregular meal timings, and high stress.",
    treatmentApproach:
      "Nux Vomica 30C was prescribed for the primary presentation (irritable, sedentary, digestive disturbance from lifestyle). Robinia 6C was used as an acute intercurrent for the sour acid reflux episodes. Patient was advised to eat smaller, regular meals and avoid eating within 2 hours of bedtime.",
    timeline:
      "Week 1: 30% reduction in heartburn frequency. Week 2-3: Able to reduce PPI to alternate days. Week 4: Heartburn only with dietary indiscretion. Week 6: Completely off antacids. Month 2: Symptom-free with sustained results on follow-up.",
    improvementPercentage: 92,
  },
  {
    id: "cs-5",
    condition: "Generalized Anxiety Disorder",
    category: "mental-wellness",
    duration: "5 months",
    outcomeSummary:
      "Anxiety symptoms reduced significantly with improved sleep quality and reduced anticipatory worry. Patient regained confidence in daily activities using Argentum Nitricum and Kali Phos.",
    narrative:
      "A 35-year-old professional presented with chronic anxiety for 2 years. Symptoms included constant worry about future events, palpitations before meetings, digestive upset from nervousness, poor sleep with racing thoughts, and avoidance of social situations. Previous therapy helped partially but symptoms persisted.",
    treatmentApproach:
      "Argentum Nitricum 200C selected based on the anticipatory anxiety, hurried feeling, and digestive involvement. Kali Phos 6X was used as a nerve tonic for daily support. Breathing exercises (4-7-8 technique) and progressive muscle relaxation were recommended alongside the remedies.",
    timeline:
      "Week 1-2: Slight improvement in sleep. Week 3-4: Anticipatory worry reducing, fewer palpitations. Month 2: Social confidence improving, able to attend meetings without dread. Month 3: Sleep quality normalized. Month 4-5: Anxiety episodes rare, manageable when they occur. Self-rated anxiety score improved from 8/10 to 3/10.",
    improvementPercentage: 75,
  },
  {
    id: "cs-6",
    condition: "Recurrent Upper Respiratory Infections",
    category: "immunity",
    duration: "4 months",
    outcomeSummary:
      "Frequency of respiratory infections dropped from every 3 weeks to once in 4 months. Overall immunity strengthened with constitutional treatment using Tuberculinum and Arsenicum Album.",
    narrative:
      "A 40-year-old patient with weak immunity, catching colds and upper respiratory infections every 2-3 weeks. History of frequent antibiotic use had further weakened natural defenses. Symptoms included nasal congestion, sneezing, low-grade fever, body aches, and persistent fatigue between episodes.",
    treatmentApproach:
      "Tuberculinum 1M was given as an intercurrent nosode to address the recurring pattern. Arsenicum Album 30C was the day-to-day constitutional remedy for the restlessness, chilliness, and thirst pattern. Vitamin C rich diet and adequate hydration were emphasized.",
    timeline:
      "Week 1-3: One mild cold managed without antibiotics. Month 1-2: No new infections, energy gradually improving. Month 3: Stamina noticeably better, no infections. Month 4: Continued clear, patient reported feeling the healthiest in years. 6-month follow-up: Only one mild cold that resolved in 2 days without medication.",
    improvementPercentage: 88,
  },
];

// ─── Category Metadata ───────────────────────────────────────────────────────

const CATEGORIES: { value: HealthCategory | "all"; label: string; icon: string }[] = [
  { value: "all", label: "All Cases", icon: "📋" },
  { value: "immunity", label: "Immunity", icon: "🛡️" },
  { value: "skin-care", label: "Skin Care", icon: "✨" },
  { value: "digestion", label: "Digestion", icon: "🌿" },
  { value: "womens-health", label: "Women's Health", icon: "🌸" },
  { value: "child-care", label: "Child Care", icon: "👶" },
  { value: "mental-wellness", label: "Mental Wellness", icon: "🧠" },
];

// ─── Components ──────────────────────────────────────────────────────────────

function ImprovementIndicator({ percentage }: { percentage: number }) {
  const getColor = () => {
    if (percentage >= 90) return "text-emerald-600 dark:text-emerald-400";
    if (percentage >= 75) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-lime-600 dark:text-lime-400";
    return "text-yellow-600 dark:text-yellow-400";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="var(--border-light)"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            className={getColor()}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${getColor()}`}>
          {percentage}%
        </span>
      </div>
      <span className="text-xs text-[var(--foreground-muted)]">improvement</span>
    </div>
  );
}

function CategoryBadge({ category }: { category: HealthCategory }) {
  const categoryInfo = CATEGORIES.find((c) => c.value === category);
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary-light)] text-[var(--primary)] dark:bg-[var(--accent-light)] dark:text-[var(--accent)]">
      {categoryInfo?.icon} {categoryInfo?.label}
    </span>
  );
}

function DurationBadge({ duration }: { duration: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--muted)] text-[var(--foreground-muted)]">
      ⏱️ {duration}
    </span>
  );
}

function CaseStudyCard({
  caseStudy,
  isExpanded,
  onToggle,
}: {
  caseStudy: CaseStudy;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        rounded-2xl border border-[var(--glass-border)]
        backdrop-blur-[12px] bg-[var(--glass-bg)]
        shadow-[var(--glass-shadow)]
        overflow-hidden cursor-pointer
        hover:shadow-lg hover:border-[var(--primary)]/30
        transition-shadow duration-300
        ${isExpanded ? "col-span-1 md:col-span-2 lg:col-span-3" : ""}
      `}
      onClick={onToggle}
      role="button"
      aria-expanded={isExpanded}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* Card Header */}
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-2">
            <CategoryBadge category={caseStudy.category} />
            <DurationBadge duration={caseStudy.duration} />
          </div>
          <ImprovementIndicator percentage={caseStudy.improvementPercentage} />
        </div>

        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          {caseStudy.condition}
        </h3>

        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-4">
          {caseStudy.outcomeSummary}
        </p>

        {/* Expand/Collapse Indicator */}
        <div className="flex items-center gap-1 text-xs text-[var(--primary)] font-medium">
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            ▼
          </motion.span>
          {isExpanded ? "Click to collapse" : "Click for full details"}
        </div>
      </div>

      {/* Expandable Detail View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-[var(--border-light)] pt-5 space-y-4">
              {/* Full Narrative */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                  Patient History
                </h4>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  {caseStudy.narrative}
                </p>
              </div>

              {/* Treatment Approach */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                  Treatment Approach
                </h4>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  {caseStudy.treatmentApproach}
                </p>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--mint-500)]" />
                  Improvement Timeline
                </h4>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  {caseStudy.timeline}
                </p>
              </div>

              {/* Consent Disclaimer */}
              <p className="text-xs text-[var(--foreground-muted)] italic border-t border-[var(--border-light)] pt-3 mt-3">
                Published with patient consent. Results may vary.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consent disclaimer on collapsed view too */}
      {!isExpanded && (
        <div className="px-5 pb-4 md:px-6 md:pb-5">
          <p className="text-xs text-[var(--foreground-muted)] italic border-t border-[var(--border-light)] pt-3">
            Published with patient consent. Results may vary.
          </p>
        </div>
      )}
    </motion.article>
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function CaseStudiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<HealthCategory | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    if (selectedCategory === "all") return MOCK_CASE_STUDIES;
    return MOCK_CASE_STUDIES.filter((cs) => cs.category === selectedCategory);
  }, [selectedCategory]);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="section-padding min-h-screen">
      <div className="container-content">
        {/* Page Header */}
        <header className="mb-10 space-y-3">
          <h1 className="text-gradient">Case Studies</h1>
          <p className="text-[var(--foreground-muted)] max-w-2xl text-sm md:text-base">
            Explore anonymized treatment cases showcasing successful homeopathic outcomes.
            Each case demonstrates the gentle yet effective approach of constitutional
            homeopathy across various health conditions.
          </p>
        </header>

        {/* Category Filter */}
        <nav aria-label="Filter case studies by category" className="mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setExpandedId(null);
                }}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200 touch-target
                  ${
                    selectedCategory === cat.value
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md"
                      : "bg-[var(--glass-bg)] backdrop-blur-[8px] border border-[var(--glass-border)] text-[var(--foreground-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                  }
                `}
                aria-pressed={selectedCategory === cat.value}
              >
                <span aria-hidden="true">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Results Count */}
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Showing {filteredCases.length}{" "}
          {filteredCases.length === 1 ? "case" : "cases"}
          {selectedCategory !== "all" && (
            <span>
              {" "}
              in{" "}
              <strong className="text-[var(--foreground-secondary)]">
                {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
              </strong>
            </span>
          )}
        </p>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((caseStudy) => (
              <CaseStudyCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                isExpanded={expandedId === caseStudy.id}
                onToggle={() => handleToggle(caseStudy.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCases.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-[var(--foreground-muted)]">
              No case studies found for this category.
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-4 px-5 py-2 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
            >
              View All Cases
            </button>
          </div>
        )}

        {/* General Disclaimer */}
        <footer className="mt-12 p-5 rounded-xl bg-[var(--muted)] border border-[var(--border-light)] text-center">
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> All case studies are anonymized and published with explicit
            patient consent. Individual results may vary. Homeopathic treatment is personalized —
            outcomes depend on individual constitution, adherence to treatment, and lifestyle factors.
            These cases are presented for informational purposes only and do not constitute medical advice.
          </p>
        </footer>
      </div>
    </main>
  );
}
