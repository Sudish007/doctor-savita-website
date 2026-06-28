'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import type { TimelineEntry, PatientTimeline } from '@/types';

/**
 * Patient Healing Timeline Page
 *
 * Displays a personalized healing journey at /my-journey/{token}.
 * - Vertical visual timeline with color-coded nodes
 * - Weekly self-assessment form (5-point emoji scale)
 * - Progress graph using Recharts
 * - Glassmorphism card styling
 *
 * Requirements: 27.1, 27.2, 27.3, 27.4, 27.6
 */

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_TIMELINE: PatientTimeline = {
  token: 'abc123xyz',
  patientName: 'Rahul Kumar',
  condition: 'Chronic Eczema (Atopic Dermatitis)',
  startDate: '2025-05-01',
  entries: [
    {
      id: '1',
      patientToken: 'abc123xyz',
      date: '2025-05-01',
      type: 'symptom',
      content:
        'Severe itching and redness on both arms and neck. Skin cracking and dry patches. Difficulty sleeping due to itching.',
      createdBy: 'doctor',
    },
    {
      id: '2',
      patientToken: 'abc123xyz',
      date: '2025-05-01',
      type: 'remedy',
      content:
        'Sulphur 200C - 3 doses over 3 days. Calendula cream for external application. Advised to avoid triggers.',
      createdBy: 'doctor',
    },
    {
      id: '3',
      patientToken: 'abc123xyz',
      date: '2025-05-08',
      type: 'assessment',
      content: 'Slight reduction in itching. Redness persists but sleep improved.',
      score: 2,
      createdBy: 'patient',
    },
    {
      id: '4',
      patientToken: 'abc123xyz',
      date: '2025-05-15',
      type: 'remedy',
      content:
        'Graphites 30C - daily for 2 weeks. Continue Calendula. Added dietary recommendations.',
      createdBy: 'doctor',
    },
    {
      id: '5',
      patientToken: 'abc123xyz',
      date: '2025-05-22',
      type: 'assessment',
      content: 'Noticeable improvement. Itching reduced by 50%. New skin growing in patches.',
      score: 3,
      createdBy: 'patient',
    },
    {
      id: '6',
      patientToken: 'abc123xyz',
      date: '2025-06-05',
      type: 'assessment',
      content: 'Skin mostly clear on arms. Neck still has mild dryness. Sleeping well.',
      score: 4,
      createdBy: 'patient',
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EMOJI_SCALE = [
  { score: 1, emoji: '😫', label: 'Very Bad' },
  { score: 2, emoji: '😐', label: 'Neutral' },
  { score: 3, emoji: '😊', label: 'Good' },
  { score: 4, emoji: '🌟', label: 'Excellent' },
  { score: 5, emoji: '💪', label: 'Fully Healed' },
] as const;

const NODE_COLORS: Record<TimelineEntry['type'], string> = {
  symptom: 'bg-red-500',
  remedy: 'bg-blue-500',
  followup: 'bg-green-500',
  assessment: 'bg-yellow-500',
};

const NODE_BORDER_COLORS: Record<TimelineEntry['type'], string> = {
  symptom: 'border-red-500',
  remedy: 'border-blue-500',
  followup: 'border-green-500',
  assessment: 'border-yellow-500',
};

const NODE_LABELS: Record<TimelineEntry['type'], string> = {
  symptom: 'Symptom Reported',
  remedy: 'Remedy Prescribed',
  followup: 'Follow-up',
  assessment: 'Self-Assessment',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getWeekNumber(startDate: string, entryDate: string): number {
  const start = new Date(startDate).getTime();
  const entry = new Date(entryDate).getTime();
  return Math.ceil((entry - start) / (7 * 24 * 60 * 60 * 1000)) || 1;
}

// ─── Components ──────────────────────────────────────────────────────────────

function TimelineNode({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Connecting line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full ${NODE_COLORS[entry.type]} ring-4 ring-background shrink-0 z-10`}
        />
        <div className="w-0.5 flex-1 bg-border-light mt-1" />
      </div>

      {/* Content card */}
      <div
        className={`flex-1 glass-card p-4 md:p-5 border-l-4 ${NODE_BORDER_COLORS[entry.type]} -mt-1`}
      >
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-fluid-caption text-foreground-muted font-medium">
            {formatDate(entry.date)}
          </span>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white ${NODE_COLORS[entry.type]}`}
          >
            {NODE_LABELS[entry.type]}
          </span>
          {entry.createdBy === 'doctor' && (
            <span className="text-xs text-primary font-medium">👩‍⚕️ Dr. Savita</span>
          )}
        </div>
        <p className="text-fluid-body-sm text-foreground-secondary leading-relaxed">
          {entry.content}
        </p>
        {entry.score && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg">{EMOJI_SCALE[entry.score - 1].emoji}</span>
            <span className="text-fluid-caption text-foreground-muted">
              {EMOJI_SCALE[entry.score - 1].label} ({entry.score}/5)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SelfAssessmentForm({ onSubmit }: { onSubmit: (score: number, note: string) => void }) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedScore === null) return;
    onSubmit(selectedScore, note);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="glass-card p-6 text-center">
        <span className="text-3xl mb-2 block">✅</span>
        <p className="text-fluid-body font-medium text-foreground">
          Assessment submitted! Thank you.
        </p>
        <p className="text-fluid-body-sm text-foreground-muted mt-1">
          Dr. Savita will review your progress.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-5 md:p-6">
      <h3 className="text-fluid-h5 font-heading font-semibold text-foreground mb-3">
        Weekly Self-Assessment
      </h3>
      <p className="text-fluid-body-sm text-foreground-muted mb-4">
        How are you feeling this week? Rate your overall condition.
      </p>

      {/* Emoji scale */}
      <div className="flex justify-between gap-1 mb-5">
        {EMOJI_SCALE.map(({ score, emoji, label }) => (
          <button
            key={score}
            type="button"
            onClick={() => setSelectedScore(score)}
            className={`flex flex-col items-center gap-1 p-2 md:p-3 rounded-xl transition-all duration-200 min-w-[52px] ${
              selectedScore === score
                ? 'bg-primary/15 ring-2 ring-primary scale-110'
                : 'hover:bg-muted hover:scale-105'
            }`}
            aria-label={`${label} - ${score} out of 5`}
          >
            <span className="text-2xl md:text-3xl">{emoji}</span>
            <span className="text-[10px] md:text-xs text-foreground-muted font-medium">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Notes */}
      <label className="block mb-4">
        <span className="text-fluid-body-sm text-foreground-secondary font-medium mb-1 block">
          Additional notes (optional)
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any changes you've noticed this week..."
          rows={3}
          className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-fluid-body-sm text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      </label>

      <button
        type="submit"
        disabled={selectedScore === null}
        className="w-full py-3 px-4 rounded-xl font-heading font-semibold text-primary-foreground bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Submit Assessment
      </button>
    </form>
  );
}

function ProgressChart({ entries, startDate }: { entries: TimelineEntry[]; startDate: string }) {
  const assessments = entries
    .filter((e) => e.type === 'assessment' && e.score)
    .map((e) => ({
      week: `Week ${getWeekNumber(startDate, e.date)}`,
      score: e.score!,
    }));

  if (assessments.length < 2) {
    return (
      <div className="glass-card p-5 md:p-6 text-center">
        <p className="text-fluid-body-sm text-foreground-muted">
          📊 Progress chart will appear after 2+ assessments.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 md:p-6">
      <h3 className="text-fluid-h5 font-heading font-semibold text-foreground mb-4">
        Your Progress
      </h3>
      <div className="w-full h-[220px] md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={assessments} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis
              dataKey="week"
              tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(val) => EMOJI_SCALE[val - 1]?.emoji || String(val)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                color: 'var(--foreground)',
              }}
              formatter={(value) => {
                const num = Number(value);
                return [
                  `${EMOJI_SCALE[num - 1]?.emoji} ${EMOJI_SCALE[num - 1]?.label}`,
                  'Score',
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: 'var(--accent)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────

interface PageProps {
  params: { token: string };
}

export default function PatientTimelinePage({ params }: PageProps) {
  // In production, this would fetch from Supabase using the token.
  // For now, use mock data if token matches, else show not found.
  const timeline: PatientTimeline | null =
    params.token === 'demo' || params.token === MOCK_TIMELINE.token
      ? MOCK_TIMELINE
      : MOCK_TIMELINE; // Fallback to mock for development; in production, null if not found.

  // Uncomment below for actual "not found" behavior:
  // const timeline: PatientTimeline | null = params.token === 'demo' ? MOCK_TIMELINE : null;

  if (!timeline) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="glass-card p-8 md:p-12 text-center max-w-md">
          <span className="text-5xl mb-4 block">🔍</span>
          <h1 className="text-fluid-h3 font-heading font-bold text-foreground mb-2">
            Timeline Not Found
          </h1>
          <p className="text-fluid-body-sm text-foreground-muted">
            This healing timeline link is invalid or has expired. Please check the link shared
            with you or contact Dr. Savita&apos;s clinic for assistance.
          </p>
        </div>
      </div>
    );
  }

  const sortedEntries = [...timeline.entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  function handleAssessmentSubmit(score: number, note: string) {
    // In production, this would POST to an API route to store in Supabase
    console.log('Assessment submitted:', { score, note, token: timeline?.token });
  }

  return (
    <div className="min-h-screen bg-background py-section-sm px-container">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="glass-card p-5 md:p-8 mb-8">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">🌿</span>
            <div>
              <h1 className="text-fluid-h3 font-heading font-bold text-foreground">
                Healing Journey
              </h1>
              <p className="text-fluid-body-sm text-foreground-muted">
                {timeline.patientName}&apos;s progress tracker
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-fluid-body-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-foreground-secondary">
                <span className="font-medium">Condition:</span> {timeline.condition}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-foreground-secondary">
                <span className="font-medium">Started:</span> {formatDate(timeline.startDate)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-border-light">
            {Object.entries(NODE_LABELS).map(([type, label]) => (
              <span key={type} className="flex items-center gap-1.5 text-xs text-foreground-muted">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${NODE_COLORS[type as TimelineEntry['type']]}`}
                />
                {label}
              </span>
            ))}
          </div>
        </header>

        {/* Progress Chart */}
        <section className="mb-8">
          <ProgressChart entries={sortedEntries} startDate={timeline.startDate} />
        </section>

        {/* Self-Assessment Form */}
        <section className="mb-8">
          <SelfAssessmentForm onSubmit={handleAssessmentSubmit} />
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-fluid-h4 font-heading font-semibold text-foreground mb-5">
            Timeline
          </h2>
          <div className="relative">
            {sortedEntries.map((entry) => (
              <TimelineNode key={entry.id} entry={entry} />
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-fluid-caption text-foreground-muted">
            🔒 This page is private and accessible only via your unique link.
            <br />
            For questions, contact Dr. Savita&apos;s clinic.
          </p>
        </div>
      </div>
    </div>
  );
}
