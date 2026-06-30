'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

/**
 * Admin Settings page — Configure seasonal alert and other site settings.
 */
export default function AdminSettingsPage() {
  const [alertTitle, setAlertTitle] = useState('')
  const [alertDescription, setAlertDescription] = useState('')
  const [alertIcon, setAlertIcon] = useState('🌧️')
  const [alertActive, setAlertActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => { loadSettings() }, [])

  async function loadSettings() {
    if (!sb) return
    try {
      const { data } = await sb
        .from('site_settings')
        .select('value')
        .eq('key', 'seasonal_alert')
        .single()

      if (data?.value) {
        const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
        setAlertTitle(parsed.title || '')
        setAlertDescription(parsed.description || '')
        setAlertIcon(parsed.icon || '🌧️')
        setAlertActive(parsed.active !== false)
      }
    } catch { /* No setting yet */ }
  }

  async function handleSave() {
    if (!sb) return
    setSaving(true)
    setMessage(null)

    const value = JSON.stringify({
      title: alertTitle.trim(),
      description: alertDescription.trim(),
      icon: alertIcon,
      active: alertActive,
    })

    try {
      // Upsert the setting
      const { error } = await sb
        .from('site_settings')
        .upsert({ key: 'seasonal_alert', value }, { onConflict: 'key' })

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('✅ Seasonal alert updated! Refresh the main site to see changes.')
      }
    } catch {
      setMessage('Failed to save')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Site Settings</h2>

      {message && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{message}</div>
      )}

      {/* Seasonal Alert Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">🌡️ Seasonal Health Alert</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={alertActive}
              onChange={(e) => setAlertActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-xs text-gray-500">Active</span>
          </label>
        </div>

        <p className="text-xs text-gray-400">This banner appears at the top of the website. Leave empty to use the default month-based alert.</p>

        <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr] gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Icon</label>
            <input
              type="text"
              value={alertIcon}
              onChange={(e) => setAlertIcon(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-lg text-center"
              maxLength={4}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title</label>
            <input
              type="text"
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              placeholder="e.g. Monsoon Health Alert"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Description</label>
          <textarea
            value={alertDescription}
            onChange={(e) => setAlertDescription(e.target.value)}
            placeholder="e.g. Stay protected from waterborne diseases. Book a consultation for preventive homeopathic care."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
          />
        </div>

        {/* Preview */}
        {alertTitle && (
          <div className="p-3 rounded-lg bg-[var(--accent-light)] border border-[var(--accent-light)]">
            <p className="text-xs text-gray-500 mb-1">Preview:</p>
            <p className="text-sm font-medium text-foreground">{alertIcon} {alertTitle}</p>
            <p className="text-xs text-foreground-muted">{alertDescription}</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Alert'}
        </button>
      </div>
    </div>
  )
}
