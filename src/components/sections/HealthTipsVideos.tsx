"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Quick Health Insights — Infinite scrolling horizontal marquee carousel.
 *
 * Features:
 * - Compact horizontal cards (minimal vertical space)
 * - CSS-based infinite scroll animation (no JS, performant)
 * - Duplicated items for seamless loop
 * - Pause on hover
 * - Responsive: smaller cards on mobile
 * - Subscribe CTA integrated inline
 *
 * Requirements: 38.1, 38.7
 */

// ─── Health Tips Data ─────────────────────────────────────────────────────────

interface HealthTip {
  id: string
  title: string
  emoji: string
  category: string
  gradient: string
}

const HEALTH_TIPS: HealthTip[] = [
  {
    id: "t1",
    title: "5 Morning Habits for Natural Immunity Boost",
    emoji: "🌅",
    category: "Immunity",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "t2",
    title: "Home Remedies for Seasonal Allergies",
    emoji: "🌿",
    category: "Skin Care",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "t3",
    title: "Understanding Homeopathic Potencies",
    emoji: "💊",
    category: "Education",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    id: "t4",
    title: "Quick Tips for Better Digestion",
    emoji: "🍎",
    category: "Digestion",
    gradient: "from-lime-500 to-green-600",
  },
  {
    id: "t5",
    title: "Natural Stress Relief: Breathing Techniques",
    emoji: "🧘",
    category: "Mental Wellness",
    gradient: "from-cyan-500 to-teal-600",
  },
  {
    id: "t6",
    title: "Building Child Immunity Naturally",
    emoji: "👶",
    category: "Child Care",
    gradient: "from-emerald-400 to-green-500",
  },
  {
    id: "t7",
    title: "Winter Skin Care with Homeopathy",
    emoji: "❄️",
    category: "Skin Care",
    gradient: "from-sky-500 to-teal-500",
  },
  {
    id: "t8",
    title: "Balancing Hormones Naturally",
    emoji: "🌸",
    category: "Women's Health",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    id: "t9",
    title: "Arnica: Nature's First Aid Remedy",
    emoji: "🩹",
    category: "First Aid",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "t10",
    title: "Sleep Better Without Medicines",
    emoji: "😴",
    category: "Sleep",
    gradient: "from-indigo-400 to-purple-500",
  },
];

// ─── Tip Card Component ──────────────────────────────────────────────────────

function TipCard({ tip }: { tip: HealthTip }) {
  return (
    <div className="flex-shrink-0 w-[260px] sm:w-[280px] group">
      <div
        className={`relative h-[130px] sm:h-[140px] rounded-2xl p-4 bg-gradient-to-br ${tip.gradient} overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 text-5xl">{tip.emoji}</div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white mb-2">
              {tip.category}
            </span>
            <h3 className="text-white font-medium text-sm leading-snug line-clamp-2">
              {tip.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <span>{tip.emoji}</span>
            <span>Dr. Savita</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Subscribe CTA Card (inline) ─────────────────────────────────────────────

function SubscribeCTACard() {
  return (
    <div className="flex-shrink-0 w-[260px] sm:w-[280px]">
      <div className="h-[130px] sm:h-[140px] rounded-2xl p-4 bg-[#25D366] flex flex-col items-center justify-center text-center shadow-md">
        <p className="text-white font-semibold text-sm mb-2">
          📱 Subscribe to MedyFacts
        </p>
        <p className="text-white/80 text-xs mb-3">
          Free daily health tips from Dr. Savita
        </p>
        <a
          href="https://whatsapp.com/channel/0029Vb5VAylJf05gA0p75W1Q"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-full text-xs font-medium bg-white text-[#25D366] hover:bg-white/90 transition-colors"
        >
          Join Channel →
        </a>
      </div>
    </div>
  );
}

// ─── Main Section Component ──────────────────────────────────────────────────

export function HealthTipsVideos() {
  const prefersReducedMotion = useReducedMotion();

  // Duplicate items for seamless loop
  const items = [...HEALTH_TIPS, ...HEALTH_TIPS];

  return (
    <section
      id="health-tips-videos"
      className="py-12 md:py-16 overflow-hidden"
      aria-labelledby="health-tips-heading"
    >
      <div className="container-content mb-6">
        {/* Section Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-accent-light text-accent-foreground mb-2">
            Health Tips
          </span>
          <h2
            id="health-tips-heading"
            className="text-fluid-h3 font-heading text-foreground mb-1"
          >
            Quick Health Insights
          </h2>
          <p className="text-foreground-muted text-sm max-w-md mx-auto">
            Bite-sized homeopathy tips from Dr. Savita
          </p>
        </motion.div>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div
        className="group relative"
        aria-label="Health tips carousel"
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div
          className={`flex gap-4 ${
            prefersReducedMotion ? '' : 'animate-marquee group-hover:[animation-play-state:paused]'
          }`}
          style={{
            width: 'max-content',
            animationDuration: '40s',
          }}
        >
          {items.map((tip, index) => (
            <div key={`${tip.id}-${index}`} className="flex-shrink-0">
              {index === 5 || index === 15 ? (
                <SubscribeCTACard />
              ) : (
                <TipCard tip={tip} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
