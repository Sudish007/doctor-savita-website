'use client'

import { useEffect, useState } from 'react'

interface Appointment {
  id: string
  patient_name: string
  phone_number: string
  preferred_date: string
  preferred_time: string
  consultation_type: 'in-person' | 'online'
  reason_for_visit: string
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled'
  created_at: string
}

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
  }, [])

  async function fetchAppointments() {
    try {
      const res = await fetch('/api/admin/appointments')
      if (res.ok) {
        const data = await res.json()
        setAppointments(data.appointments ?? [])
      } else {
        // Fallback mock data for development
        setAppointments(getMockAppointments())
      }
    } catch {
      setAppointments(getMockAppointments())
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(id: string, action: 'confirm' | 'reschedule') {
    setActionLoading(id)
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === id
              ? { ...apt, status: action === 'confirm' ? 'confirmed' : 'rescheduled' }
              : apt
          )
        )
      }
    } catch (err) {
      console.error('Action failed:', err)
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(apt.id, 'confirm')}
                          disabled={actionLoading === apt.id}
                          className="px-3 py-1 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleAction(apt.id, 'reschedule')}
                          disabled={actionLoading === apt.id}
                          className="px-3 py-1 text-xs font-medium rounded bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 transition-colors"
                        >
                          Reschedule
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
      created_at: new Date().toISOString(),
    },
  ]
}
