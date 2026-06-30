'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface Appointment {
  id: string
  patient_name: string
  phone_number: string
  preferred_date: string
  preferred_time: string
  consultation_type: 'in-person' | 'online'
  reason_for_visit: string
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'pay_at_clinic' | null
  whatsapp_sent: boolean
  notes: string | null
  prescription: string | null
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

/**
 * Admin Dashboard — Appointment management page.
 * Displays pending appointments with confirm/reschedule actions,
 * and summary statistics at the top.
 *
 * Requirements: 23.4, 23.5
 */
export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
    // Auto-refresh every 30 seconds for near real-time updates
    const interval = setInterval(fetchAppointments, 30_000)
    return () => clearInterval(interval)
  }, [])

  async function fetchAppointments() {
    try {
      // Try direct Supabase first
      if (sb) {
        const { data, error } = await sb
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (!error && data && data.length > 0) {
          setAppointments(data as Appointment[])
          setLoading(false)
          return
        }
      }

      // Fallback to API
      const res = await fetch('/api/admin/appointments')
      if (res.ok) {
        const data = await res.json()
        setAppointments(data.appointments ?? [])
      } else {
        setAppointments(getMockAppointments())
      }
    } catch {
      setAppointments(getMockAppointments())
    } finally {
      setLoading(false)
    }
  }

  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [notesId, setNotesId] = useState<string | null>(null)
  const [notesText, setNotesText] = useState('')
  const [prescriptionText, setPrescriptionText] = useState('')

  async function handleConfirm(id: string) {
    setActionLoading(id)
    try {
      if (sb) {
        await sb.from('appointments').update({ status: 'confirmed' }).eq('id', id)
      }
      setAppointments((prev) =>
        prev.map((apt) => apt.id === id ? { ...apt, status: 'confirmed' } : apt)
      )
    } catch (err) {
      console.error('Confirm failed:', err)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReschedule() {
    if (!rescheduleId || !newDate || !newTime) return
    setActionLoading(rescheduleId)
    try {
      if (sb) {
        await sb.from('appointments').update({
          preferred_date: newDate,
          preferred_time: newTime,
          status: 'pending', // keep as pending with new date
        }).eq('id', rescheduleId)
      }
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === rescheduleId
            ? { ...apt, preferred_date: newDate, preferred_time: newTime }
            : apt
        )
      )
      setRescheduleId(null)
      setNewDate('')
      setNewTime('')
    } catch (err) {
      console.error('Reschedule failed:', err)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleCancel(id: string) {
    setActionLoading(id)
    try {
      if (sb) {
        await sb.from('appointments').update({ status: 'cancelled' }).eq('id', id)
      }
      setAppointments((prev) =>
        prev.map((apt) => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
      )
    } catch (err) {
      console.error('Cancel failed:', err)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleSaveNotes() {
    if (!notesId || !sb) return
    setActionLoading(notesId)
    try {
      await sb.from('appointments').update({
        notes: notesText.trim() || null,
        prescription: prescriptionText.trim() || null,
      }).eq('id', notesId)
      setAppointments((prev) =>
        prev.map((apt) => apt.id === notesId ? { ...apt, notes: notesText.trim() || null, prescription: prescriptionText.trim() || null } : apt)
      )
      setNotesId(null)
      setNotesText('')
      setPrescriptionText('')
    } catch (err) {
      console.error('Save notes failed:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const pending = appointments.filter((a) => a.status === 'pending')
  const confirmed = appointments.filter((a) => a.status === 'confirmed')
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter((a) => a.preferred_date === today)

  // Sort pending by date ascending
  const sortedPending = [...pending].sort(
    (a, b) => new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime()
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading appointments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Appointment Dashboard
      </h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Pending" value={pending.length} color="yellow" />
        <StatCard label="Confirmed" value={confirmed.length} color="green" />
        <StatCard label="Today" value={todayAppointments.length} color="blue" />
      </div>

      {/* Pending Appointments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pending Appointments ({sortedPending.length})
          </h3>
        </div>

        {sortedPending.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            No pending appointments.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Patient
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Reason
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Payment
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    WA Proof
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedPending.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                      {apt.patient_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {apt.phone_number}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {apt.preferred_date}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {apt.preferred_time}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          apt.consultation_type === 'online'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {apt.consultation_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                      {apt.reason_for_visit}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          apt.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : apt.payment_status === 'pay_at_clinic'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {apt.payment_status === 'paid' ? '✓ Paid' : apt.payment_status === 'pay_at_clinic' ? '🏥 At Clinic' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {apt.whatsapp_sent ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">✓ Sent</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleConfirm(apt.id)}
                          disabled={actionLoading === apt.id}
                          className="px-3 py-1 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => { setRescheduleId(apt.id); setNewDate(apt.preferred_date); setNewTime(apt.preferred_time); }}
                          disabled={actionLoading === apt.id}
                          className="px-3 py-1 text-xs font-medium rounded bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 transition-colors"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => { setNotesId(apt.id); setNotesText(apt.notes || ''); setPrescriptionText(apt.prescription || ''); }}
                          className="px-3 py-1 text-xs font-medium rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                          📝 Notes
                        </button>
                        <button
                          onClick={() => handleCancel(apt.id)}
                          disabled={actionLoading === apt.id}
                          className="px-3 py-1 text-xs font-medium rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reschedule Appointment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">New Time</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setRescheduleId(null)}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={!newDate || !newTime}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
              >
                Save New Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes/Prescription Modal */}
      {notesId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📝 Doctor&apos;s Notes & Prescription</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Clinical Notes</label>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  rows={3}
                  placeholder="Observations, diagnosis, follow-up instructions..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Prescription</label>
                <textarea
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  rows={4}
                  placeholder="Remedy name, potency, dosage, duration..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setNotesId(null)}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: 'yellow' | 'green' | 'blue'
}) {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  }

  const valueClasses = {
    yellow: 'text-yellow-700 dark:text-yellow-300',
    green: 'text-green-700 dark:text-green-300',
    blue: 'text-blue-700 dark:text-blue-300',
  }

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${valueClasses[color]}`}>{value}</p>
    </div>
  )
}

/** Mock data fallback for development without Supabase */
function getMockAppointments(): Appointment[] {
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  return [
    {
      id: '1',
      patient_name: 'Ramesh Kumar',
      phone_number: '9876543210',
      preferred_date: today,
      preferred_time: '10:00',
      consultation_type: 'in-person',
      reason_for_visit: 'Chronic skin rashes and itching for 2 weeks',
      status: 'pending',
      payment_status: 'paid',
      whatsapp_sent: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      patient_name: 'Sunita Devi',
      phone_number: '8765432109',
      preferred_date: today,
      preferred_time: '11:30',
      consultation_type: 'online',
      reason_for_visit: 'Follow-up for digestive issues',
      status: 'pending',
      payment_status: 'pending',
      whatsapp_sent: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      patient_name: 'Anil Sharma',
      phone_number: '7654321098',
      preferred_date: tomorrow,
      preferred_time: '09:30',
      consultation_type: 'in-person',
      reason_for_visit: 'Joint pain and morning stiffness',
      status: 'confirmed',
      payment_status: 'pay_at_clinic',
      whatsapp_sent: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      patient_name: 'Priya Singh',
      phone_number: '9988776655',
      preferred_date: tomorrow,
      preferred_time: '14:00',
      consultation_type: 'in-person',
      reason_for_visit: 'Hair fall treatment consultation',
      status: 'pending',
      payment_status: 'paid',
      whatsapp_sent: true,
      created_at: new Date().toISOString(),
    },
  ]
}
