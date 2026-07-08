'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { Navigation } from "@/components/layout/Navigation"


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

interface Appointment {
  id: string
  patient_name: string
  phone_number: string
  preferred_date: string
  preferred_time: string
  consultation_type: string
  reason_for_visit: string
  status: string
  payment_status: string | null
  notes: string | null
  prescription: string | null
  created_at: string
}

interface Token {
  id: string
  patient_name: string
  token_number: number
  patient_id: string | null
  created_at: string
}

/**
 * Patient Portal — /my-appointments
 * Patients enter their phone number to view all appointments, tokens, and prescriptions.
 */
export default function MyAppointmentsPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [tokens, setTokens] = useState<Token[]>([])

  async function handleSearch() {
    if (!sb || phone.trim().length < 10) return
    setLoading(true)
    setSearched(false)

    const cleanPhone = phone.trim().replace(/^\+91/, '').replace(/\D/g, '')

    try {
      // Fetch appointments
      const { data: appts } = await sb
        .from('appointments')
        .select('*')
        .eq('phone_number', cleanPhone)
        .order('created_at', { ascending: false })

      // Fetch tokens
      const { data: tkns } = await sb
        .from('queue_subscriptions')
        .select('*')
        .eq('phone_number', cleanPhone)
        .order('created_at', { ascending: false })
        .limit(10)

      setAppointments((appts as Appointment[]) || [])
      setTokens((tkns as Token[]) || [])
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const upcoming = appointments.filter(a => a.preferred_date >= new Date().toISOString().split('T')[0] && a.status !== 'cancelled')
  const past = appointments.filter(a => a.preferred_date < new Date().toISOString().split('T')[0] || a.status === 'cancelled')

  return (
    <>
      <Navigation />
      <div className="pt-16 md:pt-20 pb-24 min-h-screen bg-background">
      <div className="container-content max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">📋 My Appointments</h1>
            <p className="text-foreground-muted text-sm">View your appointments, prescriptions, and token history</p>
          </div>

          {/* Phone Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl mb-6"
          >
            <label className="block text-sm font-medium text-foreground-secondary mb-2">
              Enter your phone number
            </label>
            <div className="flex gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9870176701"
                maxLength={10}
                className="flex-1 px-4 py-3 rounded-xl text-sm bg-background-secondary text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading || phone.trim().length < 10}
                className="px-6 py-3 rounded-xl font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 transition-colors"
              >
                {loading ? '⏳' : '🔍 Search'}
              </button>
            </div>
            <p className="text-xs text-foreground-muted mt-2">Same number you used while booking</p>
          </motion.div>

          {/* Results */}
          {searched && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {appointments.length === 0 && tokens.length === 0 ? (
                <div className="glass-card p-8 rounded-2xl text-center">
                  <p className="text-3xl mb-3">🤷</p>
                  <p className="text-foreground-muted">No appointments found for this phone number.</p>
                  <a href="/book" className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary-hover">
                    Book Your First Appointment
                  </a>
                </div>
              ) : (
                <>
                  {/* Upcoming Appointments */}
                  {upcoming.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-3">📅 Upcoming</h2>
                      <div className="space-y-3">
                        {upcoming.map(apt => (
                          <AppointmentCard key={apt.id} apt={apt} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past Appointments */}
                  {past.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-3">📂 Past</h2>
                      <div className="space-y-3">
                        {past.map(apt => (
                          <AppointmentCard key={apt.id} apt={apt} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Token History */}
                  {tokens.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-3">🎟️ Token History</h2>
                      <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="divide-y divide-border-light">
                          {tokens.map(t => (
                            <div key={t.id} className="px-4 py-3 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-primary">Token #{t.token_number}</span>
                                {t.patient_id && <span className="ml-2 text-xs text-foreground-muted font-mono">{t.patient_id}</span>}
                              </div>
                              <span className="text-xs text-foreground-muted">
                                {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Book another */}
                  <div className="text-center pt-4">
                    <a href="/book" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary-hover">
                      📅 Book New Appointment
                    </a>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

/** Appointment Card component */
function AppointmentCard({ apt }: { apt: Appointment }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    rescheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }

  const paymentLabels: Record<string, string> = {
    paid: '✓ Paid via UPI',
    pay_at_clinic: '🏥 Pay at Clinic',
    pending: '⏳ Payment Pending',
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">
              {new Date(apt.preferred_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-sm text-foreground-muted">| {apt.preferred_time}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[apt.status] || 'bg-gray-100 text-gray-600'}`}>
              {apt.status}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {apt.consultation_type}
            </span>
            {apt.payment_status && (
              <span className="text-xs text-foreground-muted">
                {paymentLabels[apt.payment_status] || apt.payment_status}
              </span>
            )}
          </div>
          <p className="text-sm text-foreground-muted">{apt.reason_for_visit}</p>

          {/* Doctor's Notes */}
          {apt.notes && (
            <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-0.5">📝 Doctor&apos;s Notes</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{apt.notes}</p>
            </div>
          )}

          {/* Prescription */}
          {apt.prescription && (
            <div className="mt-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-0.5">💊 Prescription</p>
              <p className="text-sm text-emerald-800 dark:text-emerald-200 whitespace-pre-line">{apt.prescription}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
