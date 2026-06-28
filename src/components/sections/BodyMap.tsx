"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Interactive Body Symptom Map section.
 * - SVG human body diagram (front view) with clickable regions
 * - Click handler highlights region with green accent, displays conditions panel
 * - Multi-selection with summary panel
 * - "Book Consultation for This" button (pre-fills Appointment Form)
 * - "Get Personalized Advice" button opening chatbot with selected regions
 * - Responsive scaling (min 280px), 44x44px tap targets, hover glow on desktop
 *
 * Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6
 */

// ─── Region Data ─────────────────────────────────────────────────────────────

interface BodyRegion {
  id: string;
  label: string;
  conditions: string[];
}

const BODY_REGIONS: BodyRegion[] = [
  { id: "head", label: "Head", conditions: ["Headache", "Migraine", "Sinusitis"] },
  { id: "eyes", label: "Eyes", conditions: ["Eye strain", "Allergies", "Conjunctivitis"] },
  { id: "throat", label: "Throat", conditions: ["Sore throat", "Tonsillitis", "Thyroid"] },
  { id: "chest", label: "Chest", conditions: ["Cough", "Asthma", "Bronchitis"] },
  { id: "stomach", label: "Stomach", conditions: ["Acidity", "IBS", "Bloating"] },
  { id: "back", label: "Back", conditions: ["Back pain", "Sciatica", "Spondylitis"] },
  { id: "joints", label: "Joints", conditions: ["Arthritis", "Joint pain", "Gout"] },
  { id: "skin", label: "Skin", conditions: ["Eczema", "Acne", "Psoriasis"] },
  { id: "reproductive", label: "Reproductive", conditions: ["PCOS", "Fertility", "Menstrual issues"] },
  { id: "feet", label: "Feet", conditions: ["Heel pain", "Fungal infection", "Plantar fasciitis"] },
];

// ─── SVG Region Positions (front view, viewBox 0 0 200 400) ─────────────────

interface RegionShape {
  id: string;
  type: "ellipse" | "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

const REGION_SHAPES: RegionShape[] = [
  { id: "head", type: "ellipse", x: 100, y: 38, width: 36, height: 40, rx: 18, ry: 20 },
  { id: "eyes", type: "ellipse", x: 100, y: 32, width: 28, height: 12, rx: 14, ry: 6 },
  { id: "throat", type: "rect", x: 88, y: 60, width: 24, height: 20 },
  { id: "chest", type: "rect", x: 72, y: 85, width: 56, height: 50 },
  { id: "stomach", type: "ellipse", x: 100, y: 160, width: 44, height: 36, rx: 22, ry: 18 },
  { id: "back", type: "rect", x: 78, y: 100, width: 44, height: 60 },
  { id: "joints", type: "rect", x: 56, y: 195, width: 22, height: 30 },
  { id: "skin", type: "rect", x: 54, y: 90, width: 16, height: 70 },
  { id: "reproductive", type: "ellipse", x: 100, y: 200, width: 38, height: 28, rx: 19, ry: 14 },
  { id: "feet", type: "rect", x: 76, y: 350, width: 48, height: 30 },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function BodyMap() {
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const prefersReducedMotion = useReducedMotion();

  const toggleRegion = useCallback((regionId: string) => {
    setSelectedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  }, []);

  const getSelectedConditions = useCallback(() => {
    const conditions: string[] = [];
    selectedRegions.forEach((regionId) => {
      const region = BODY_REGIONS.find((r) => r.id === regionId);
      if (region) {
        conditions.push(...region.conditions);
      }
    });
    return conditions;
  }, [selectedRegions]);

  const getSelectedLabels = useCallback(() => {
    return BODY_REGIONS.filter((r) => selectedRegions.has(r.id)).map((r) => r.label);
  }, [selectedRegions]);

  const buildConsultationLink = useCallback(() => {
    const labels = getSelectedLabels();
    const reasonText = labels.length > 0
      ? `Concerns: ${labels.join(", ")}`
      : "";
    return `#appointment?reason=${encodeURIComponent(reasonText)}`;
  }, [getSelectedLabels]);

  const handleChatbotOpen = useCallback(() => {
    const labels = getSelectedLabels();
    // Dispatch custom event that the chatbot widget can listen to
    const event = new CustomEvent("open-chatbot", {
      detail: { regions: labels, conditions: getSelectedConditions() },
    });
    window.dispatchEvent(event);
  }, [getSelectedLabels, getSelectedConditions]);

  // Animation
  const panelVariants = {
    hidden: { opacity: 0, y: 12, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 12,
      height: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.2, ease: "easeIn" },
    },
  };

  return (
    <section
      id="body-map"
      className="section-padding"
      aria-labelledby="body-map-heading"
    >
      <div className="container-content">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2
            id="body-map-heading"
            className="text-fluid-h2 text-foreground mb-3"
          >
            Interactive Symptom Map
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto text-fluid-body">
            Tap on body areas where you experience discomfort. Select multiple
            regions to describe your concerns.
          </p>
        </motion.div>

        {/* Main Grid: Body SVG + Conditions Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* SVG Body Diagram */}
          <div className="flex justify-center">
            <div
              className="relative w-full max-w-[320px]"
              style={{ minWidth: "280px" }}
            >
              <svg
                viewBox="0 0 200 400"
                className="w-full h-auto"
                role="img"
                aria-label="Human body diagram with clickable symptom regions"
              >
                {/* Body Silhouette */}
                <g className="fill-muted stroke-border" strokeWidth="0.5">
                  {/* Head */}
                  <ellipse cx="100" cy="38" rx="22" ry="26" />
                  {/* Neck */}
                  <rect x="92" y="62" width="16" height="16" rx="3" />
                  {/* Torso */}
                  <path d="M72 78 Q72 75 76 74 L124 74 Q128 75 128 78 L132 180 Q132 190 125 195 L75 195 Q68 190 68 180 Z" />
                  {/* Left Arm */}
                  <path d="M72 80 L54 90 L48 160 L56 162 L62 100 L72 92" />
                  {/* Right Arm */}
                  <path d="M128 80 L146 90 L152 160 L144 162 L138 100 L128 92" />
                  {/* Left Leg */}
                  <path d="M78 195 L74 280 L70 350 L68 370 L90 370 L88 350 L90 280 L94 195" />
                  {/* Right Leg */}
                  <path d="M106 195 L110 280 L112 350 L110 370 L132 370 L130 350 L126 280 L122 195" />
                </g>

                {/* Clickable Regions (overlaid on silhouette) */}
                {REGION_SHAPES.map((shape) => {
                  const isSelected = selectedRegions.has(shape.id);
                  const region = BODY_REGIONS.find((r) => r.id === shape.id);

                  return (
                    <g key={shape.id}>
                      {shape.type === "ellipse" ? (
                        <ellipse
                          cx={shape.x}
                          cy={shape.y}
                          rx={shape.rx!}
                          ry={shape.ry!}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "fill-accent/40 stroke-accent stroke-[2]"
                              : "fill-transparent stroke-primary/30 stroke-[1] hover:fill-primary/15 hover:stroke-primary"
                          }`}
                          style={{
                            filter: isSelected
                              ? "drop-shadow(0 0 6px var(--accent))"
                              : undefined,
                          }}
                          onClick={() => toggleRegion(shape.id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`${region?.label ?? shape.id} region${isSelected ? " (selected)" : ""}`}
                          aria-pressed={isSelected}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleRegion(shape.id);
                            }
                          }}
                        />
                      ) : (
                        <rect
                          x={shape.x}
                          y={shape.y}
                          width={shape.width}
                          height={shape.height}
                          rx={4}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "fill-accent/40 stroke-accent stroke-[2]"
                              : "fill-transparent stroke-primary/30 stroke-[1] hover:fill-primary/15 hover:stroke-primary"
                          }`}
                          style={{
                            filter: isSelected
                              ? "drop-shadow(0 0 6px var(--accent))"
                              : undefined,
                          }}
                          onClick={() => toggleRegion(shape.id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`${region?.label ?? shape.id} region${isSelected ? " (selected)" : ""}`}
                          aria-pressed={isSelected}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleRegion(shape.id);
                            }
                          }}
                        />
                      )}
                      {/* Region Label */}
                      <text
                        x={shape.x + (shape.type === "rect" ? shape.width / 2 : 0)}
                        y={shape.y + (shape.type === "rect" ? shape.height + 10 : (shape.ry! + 8))}
                        textAnchor="middle"
                        className={`text-[6px] pointer-events-none select-none ${
                          isSelected ? "fill-accent" : "fill-foreground-muted"
                        }`}
                        aria-hidden="true"
                      >
                        {region?.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Touch-target instruction (mobile) */}
              <p className="text-center text-foreground-muted text-fluid-caption mt-2 lg:hidden">
                Tap areas to select symptoms
              </p>
            </div>
          </div>

          {/* Right Panel: Conditions + Summary + Actions */}
          <div className="space-y-6">
            {/* Conditions Panel (shows for last selected region) */}
            <AnimatePresence mode="wait">
              {selectedRegions.size > 0 && (
                <motion.div
                  key="conditions-panel"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="glass-card p-5 md:p-6"
                >
                  <h3 className="text-fluid-h5 text-foreground mb-4">
                    Conditions by Area
                  </h3>
                  <div className="space-y-3">
                    {BODY_REGIONS.filter((r) => selectedRegions.has(r.id)).map(
                      (region) => (
                        <div key={region.id}>
                          <h4 className="text-sm font-semibold text-primary mb-1">
                            {region.label}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {region.conditions.map((condition) => (
                              <span
                                key={condition}
                                className="inline-block px-2.5 py-1 rounded-full text-xs bg-accent-light text-accent-foreground border border-accent/20"
                              >
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary Panel */}
            <AnimatePresence>
              {selectedRegions.size > 0 && (
                <motion.div
                  key="summary-panel"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="glass-card p-5 md:p-6"
                >
                  <h3 className="text-fluid-h5 text-foreground mb-3">
                    Your Selected Concerns
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {getSelectedLabels().map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-primary-light text-primary border border-primary/20 font-medium"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={buildConsultationLink()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] min-w-[44px]"
                    >
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
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Book Consultation for This
                    </a>
                    <button
                      type="button"
                      onClick={handleChatbotOpen}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-white font-medium text-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] min-w-[44px]"
                    >
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
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Get Personalized Advice
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {selectedRegions.size === 0 && (
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-6 md:p-8 text-center"
              >
                <div className="text-primary/40 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <p className="text-foreground-secondary text-fluid-body">
                  Click or tap on the body areas to identify your concerns
                </p>
                <p className="text-foreground-muted text-fluid-caption mt-1">
                  You can select multiple areas
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
