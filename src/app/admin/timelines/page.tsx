'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface Timeline {
  id: string
  patient_name: string
  phone: string
  condition: string
  start_date: string
  last_assessment: string | null
  notes: string | null
  is_active: boolean
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

/**
 * Admin Patient Timelines — Track long-term treatment progress.
 * Connected to Supabase `patient_timelines` table.
 */
export default function AdminTimelinesPage() {
  const [timelines, setTimelines] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ patient_name: '', phone: '', condition: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<'active' | 'all'>('active')

  useEffect(() => { fetchTimelines() }, [])

  async function fetchTimelines() {
    if (!sb) { setLoading(false); return }
    try {
      const { data } = await sb.from('patient_timelines').select('*').order('created_at', { ascending: false })
      if (data) setTimelines(data as Timeline[])
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function handleAdd() {
    if (!sb || !form.patient_name.trim() || !form.condition.trim()) return
    setSaving(true)
    try {
      await sb.from('patient_timelines').insert({
        patient_name: form.patient_name.trim(),
        phone: form.phone.trim() || null,
        condition: form.condition.trim(),
        notes: form.notes.trim() || null,
        start_date: new Date().toISOString().split('T')[0],
        is_active: true,
      })
      setShowForm(false)
      setForm({ patient_name: '', phone: '', condition: '', notes: '' })
      fetchTimelines()
    } catch { /* ignore */ }
    setSaving(false)
  }

  async function toggleActive(id: string, current: boolean) {
    if (!sb) return
    await sb.from('patient_timelines').update({ is_active: !current }).eq('id', id)
    setTimelines(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t))
  }

  async function updateAssessment(id: string) {
    if (!sb) return
    const today = new Date().toISOString().split('T')[0]
    await sb.from('patient_timelines').update({ last_assessment: today }).eq('id', id)
    setTimelines(prev => prev.map(t => t.id === id ? { ...t, last_assessment: today } : t))
  }

  async function handleDelete(id: string) {
    if (!sb || !confirm('Delete this timeline?')) return
    await sb.from('patient_timelines').delete().eq('id', id)
    setTimelines(prev => prev.filter(t => t.id !== id))
  }

  const filtered = filter === 'active' ? timelines.filter(t => t.is_active) : timelines

  if (loading) return <div className="text-center py-12 text-gray-500">Loading timelines...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Patient Timelines</h2>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button onClick={() => setFilter('active')} className={`px-3 py-1 text-xs rounded-md ${filter === 'active' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>Active</button>
            <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs rounded-md ${filter === 'all' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>All</button>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700">
            {showForm ? 'Cancel' : '+ Add Patient'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-300">{timelines.filter(t => t.is_active).length}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{timelines.length}</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Patient Name" value={form.patient_name} onChange={e => setForm({...form, patient_name: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <input type="text" placeholder="Condition (e.g. Chronic eczema, PCOS)" value={form.condition} onChange={e => setForm({...form, condition: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          <textarea placeholder="Initial notes (optional)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none" />
          <button onClick={handleAdd} disabled={saving || !form.patient_name.trim() || !form.condition.trim()} className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Adding...' : 'Add Timeline'}
          </button>
        </div>
      )}

      {/* Timelines List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">No timelines found.</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filtered.map(t => (
              <div key={t.id} className="px-4 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{t.patient_name}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${t.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-500'}`}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{t.condition}</p>
                  {t.notes && <p className="text-xs text-gray-400 mt-1 italic">{t.notes}</p>}
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    <span>Started: {t.start_date}</span>
                    {t.last_assessment && <span>Last assessment: {t.last_assessment}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => updateAssessment(t.id)} className="px-2 py-1 text-[10px] rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">Mark Assessed</button>
                  <button onClick={() => toggleActive(t.id, t.is_active)} className="px-2 py-1 text-[10px] rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300">{t.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleDelete(t.id)} className="px-2 py-1 text-[10px] rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
