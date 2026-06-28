'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FIRST_AID_SCENARIOS, type FirstAidScenario } from './data';

/**
 * First-Aid Guide client component with interactive search and expandable cards.
 * Requirements: 36.1, 36.2, 36.3, 36.5, 36.6, 36.7
 */

export function FirstAidClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter scenarios based on keyword search (min 2 chars)
  const filteredScenarios = useMemo(() => {
    if (searchQuery.length < 2) return FIRST_AID_SCENARIOS;
    const query = searchQuery.toLowerCase();
    return FIRST_AID_SCENARIOS.filter(
      (scenario) =>
        scenario.name.toLowerCase().includes(query) ||
        scenario.actionSteps.some((step) => step.toLowerCase().includes(query)) ||
        scenario.remedy.toLowerCase().includes(query) ||
        scenario.emergencyWarning.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const shareViaWhatsApp = (scenario: FirstAidScenario) => {
    const message = formatWhatsAppMessage(scenario);
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      {/* Emergency Banner */}
      <EmergencyBanner />

      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-gradient">First-Aid Guide</h1>
        <p className="text-[var(--foreground-muted)] max-w-2xl">
          Quick reference for common emergencies with homeopathic first-aid remedies.
          This guide is for minor first-aid only — always consult a doctor for persistent
          or severe symptoms.
        </p>
      </header>

      {/* Search Input */}
      <div className="relative max-w-md">
        <label htmlFor="first-aid-search" className="sr-only">
          Search first-aid scenarios
        </label>
        <input
          id="first-aid-search"
          type="search"
          placeholder="Search scenarios (e.g. fever, burns, sprains)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] 
                     px-4 py-3 pl-11 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]
                     focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]
                     transition-colors"
          aria-label="Search first-aid scenarios"
        />
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--foreground-muted)]" />
      </div>

      {/* Results Count */}
      {searchQuery.length >= 2 && (
        <p className="text-sm text-[var(--foreground-muted)]">
          {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredScenarios.map((scenario) => (
            <FirstAidCard
              key={scenario.id}
              scenario={scenario}
              isExpanded={expandedId === scenario.id}
              onToggle={() => toggleExpand(scenario.id)}
              onShare={() => shareViaWhatsApp(scenario)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredScenarios.length === 0 && searchQuery.length >= 2 && (
        <div className="text-center py-12">
          <p className="text-[var(--foreground-muted)] text-lg">
            No scenarios found for &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-[var(--foreground-muted)] text-sm mt-2">
            Try different keywords or browse all scenarios by clearing your search.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Emergency Banner ─────────────────────────────────────────────────────── */

function EmergencyBanner() {
  return (
    <div
      role="alert"
      className="rounded-xl border-2 border-red-500/30 bg-red-50 dark:bg-red-950/20 
                 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
    >
      <span className="text-2xl flex-shrink-0" aria-hidden="true">🚨</span>
      <div>
        <p className="font-semibold text-red-700 dark:text-red-400 text-lg">
          FOR EMERGENCIES: Call 108 (Ambulance) or visit the nearest hospital.
        </p>
        <p className="text-red-600 dark:text-red-400/80 text-sm mt-0.5">
          This guide is for minor first-aid only. Do not delay emergency medical care.
        </p>
      </div>
    </div>
  );
}

/* ─── First Aid Card ───────────────────────────────────────────────────────── */

interface FirstAidCardProps {
  scenario: FirstAidScenario;
  isExpanded: boolean;
  onToggle: () => void;
  onShare: () => void;
}

function FirstAidCard({ scenario, isExpanded, onToggle, onShare }: FirstAidCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] 
                 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Card Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left
                   hover:bg-[var(--muted)] transition-colors touch-target"
        aria-expanded={isExpanded}
        aria-controls={`scenario-${scenario.id}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{scenario.icon}</span>
          <h2 className="font-semibold text-[var(--card-foreground)] text-base md:text-lg">
            {scenario.name}
          </h2>
        </div>
        <ChevronIcon isOpen={isExpanded} />
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`scenario-${scenario.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-[var(--border-light)]">
              {/* Action Steps */}
              <div className="pt-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground-muted)] mb-2">
                  Immediate Steps
                </h3>
                <ol className="space-y-1.5 list-decimal list-inside text-[var(--card-foreground)]">
                  {scenario.actionSteps.map((step, i) => (
                    <li key={i} className="text-sm leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>

              {/* Recommended Remedy */}
              <div className="rounded-lg bg-[var(--muted)] p-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground-muted)] mb-1">
                  Recommended Remedy
                </h3>
                <p className="text-[var(--card-foreground)] font-medium">
                  {scenario.remedy}
                </p>
                <p className="text-sm text-[var(--foreground-secondary)] mt-0.5">
                  Potency: <span className="font-medium">{scenario.potency}</span> &bull; 
                  Dosage: <span className="font-medium">{scenario.dosage}</span>
                </p>
              </div>

              {/* Emergency Warning */}
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 p-3">
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                  ⚠️ When to Seek Emergency Care
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400/90">
                  {scenario.emergencyWarning}
                </p>
              </div>

              {/* Share Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#128C7E] 
                           text-white px-4 py-2.5 text-sm font-medium transition-colors touch-target"
                aria-label={`Share ${scenario.name} first-aid guide via WhatsApp`}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Share via WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ─── Helper Functions ─────────────────────────────────────────────────────── */

function formatWhatsAppMessage(scenario: FirstAidScenario): string {
  const steps = scenario.actionSteps.map((s, i) => `${i + 1}. ${s}`).join('\n');
  return (
    `🏥 *First-Aid: ${scenario.name}*\n\n` +
    `*Immediate Steps:*\n${steps}\n\n` +
    `💊 *Remedy:* ${scenario.remedy}\n` +
    `*Potency:* ${scenario.potency} | *Dosage:* ${scenario.dosage}\n\n` +
    `⚠️ *Seek Emergency Care:* ${scenario.emergencyWarning}\n\n` +
    `— Dr. Savita Kumari | Homeopathic Medical Officer`
  );
}

/* ─── Icons ────────────────────────────────────────────────────────────────── */

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`h-5 w-5 text-[var(--foreground-muted)] transition-transform duration-200 flex-shrink-0 ${
        isOpen ? 'rotate-180' : ''
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
