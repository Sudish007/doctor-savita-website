'use client'

import { useEffect, useState } from 'react'

interface PatientTimelineSummary {
  token: string
  patient_name: string
  condition: string
  start_date: string
  last_assessment_date: string | null
  is_active: boolean
}

/**
 * Admin Patient Timelines page.
 * Lists active patient timelines with filters and summary info.
 *
 * Requirements: 27.5
 */
export default function AdminTimelinesPage() {
  const [timelines, setTimelines] = useState<PatientTimelineSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'active' | 'all'>('active')

  useEffect(() => {
    fetchTimelines()
  }, [])

  async function fetchTimelines() {
    try {
      const res = await fetch('/api/admin/timelines')
      if (res.ok) {
        const data = await res.json()
        setTimelines(data.timelines ?? [])
      } else {
        setTimelines(getMockTimelines())
      }
    } catch {
      setTimelines(getMockTimelines())
    } finally {
      setLoading(false)
    }
  }

  const filteredTimelines =
    filter === 'active' ? timelines.filter((t) => t.is_active) : timelines

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading patient timelines...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Patient Timelines
        </h2>

        {/* Filter Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'active'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-300">
            {timelines.filter((t) => t.is_active).length}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
            {timelines.length}
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredTimelines.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            No timelines found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTimelines.map((timeline) => (
              <div
                key={timeline.token}
                className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {timeline.patient_name}
                    </p>
                    {timeline.is_active ? (
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {timeline.condition}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 ml-4 flex-shrink-0">
                  <p>Started: {timeline.start_date}</p>
                  {timeline.last_assessment_date && (
                    <p className="mt-1">Last assessment: {timeline.last_assessment_date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Mock data fallback */
function getMockTimelines(): PatientTimelineSummary[] {
  return [
    {
      token: 'TL001',
      patient_name: 'Aarti Devi',
      condition: 'Chronic eczema — whole body',
      start_date: '2025-01-15',
      last_assessment_date: '2025-06-20',
      is_active: true,
    },
    {
      token: 'TL002',
      patient_name: 'Mohan Lal',
      condition: 'Migraine and anxiety',
      start_date: '2025-03-01',
      last_assessment_date: '2025-06-18',
      is_active: true,
    },
    {
      token: 'TL003',
      patient_name: 'Kavita Singh',
      condition: 'PCOS and hormonal imbalance',
      start_date: '2025-02-10',
      last_assessment_date: '2025-05-30',
      is_active: true,
    },
    {
      token: 'TL004',
      patient_name: 'Rajesh Verma',
      condition: 'Asthma follow-up',
      start_date: '2024-11-05',
      last_assessment_date: '2025-04-15',
      is_active: false,
    },
    {
      token: 'TL005',
      patient_name: 'Sunita Sharma',
      condition: 'Digestive issues — IBS',
      start_date: '2025-04-20',
      last_assessment_date: null,
      is_active: true,
    },
  ]
}
