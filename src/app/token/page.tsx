'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { Navigation } from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

/**
 * Standalone Token Page — /token
 * Patients can take a token for the queue from this dedicated page.
 * Shows queue status + take token form + token confirmation.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

function generatePatientId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'P-'
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

export default function TokenPage() {
  const [patientName, setPatientName] = useState('')
  const [phone, setPhone] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [myToken, setMyToken] = useState<number | null>(null)
  const [myPatientId, setMyPatientId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  /** Download ticket as image using html2canvas-like approach via Canvas API */
  async function downloadTicket() {
    const ticket = document.getElementById('token-ticket')
    if (!ticket) return
    try {
      // Use html2canvas dynamic import
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(ticket, { scale: 2, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = `token-${myToken}-${myPatientId || 'ticket'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      // Fallback: copy text info
      const text = `🎟️ Token #${myToken}\nID: ${myPatientId}\nName: ${patientName || 'Walk-in'}\nPhone: ${phone || 'N/A'}\nDate: ${new Date().toLocaleDateString()}\n📍 Saubhagya Multispeciality Clinic, Village Pipra, Siwan`
      navigator.clipboard.writeText(text)
      alert('Ticket info copied! (Image download requires html2canvas)')
    }
  }

  async function handleTakeToken() {
    setIsJoining(true)
    setError(null)
    const patientId = generatePatientId()

    try {
      if (!sb) {
        setError('Service unavailable. Please try again.')
        return
      }

      // Count today's tokens
      const today = new Date().toISOString().split('T')[0]
      const { count } = await sb
        .from('queue_subscriptions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)

      const assignedToken = (count || 0) + 1

      // Save to queue_subscriptions
      const { error: insertError } = await sb
        .from('queue_subscriptions')
        .insert({
          phone_number: phone.trim() || 'N/A',
          token_number: assignedToken,
          patient_id: patientId,
          patient_name: patientName.trim() || 'Walk-in',
          notified: false,
        })

      if (insertError) {
        setError('Failed to get token. Please try again.')
        return
      }

      // Update queue_status waiting count
      await sb
        .from('queue_status')
        .update({ waiting_count: assignedToken })
        .eq('id', 1)

      setMyToken(assignedToken)
      setMyPatientId(patientId)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 pt-16 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🎟️ Take Your Token
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Saubhagya Multispeciality Clinic — Dr. Savita Kumari
          </p>
        </div>

        {myToken ? (
          /* Token Assigned - Movie Ticket Style */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden"
          >
            {/* Ticket Card */}
            <div id="token-ticket" className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-emerald-300 dark:border-emerald-700">
              {/* Ticket Header - Clinic Name */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-center">
                <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Saubhagya Multispeciality Clinic</p>
                <p className="text-white font-bold text-lg mt-1">Dr. Savita Kumari (BHMS)</p>
                <p className="text-emerald-200 text-xs mt-0.5">Medical Officer, AYUSH Dept., Govt. of Bihar</p>
              </div>

              {/* Dashed separator */}
              <div className="px-4 py-2">
                <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-600"></div>
              </div>

              {/* Token Number - Large Center */}
              <div className="text-center py-4 px-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Token Number</p>
                <p className="text-6xl font-black text-emerald-600 dark:text-emerald-400 mt-2 mb-3">#{myToken}</p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-mono font-medium">
                  {myPatientId}
                </div>
              </div>

              {/* Patient Details Grid */}
              <div className="px-6 pb-5 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Patient Name</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{patientName || 'Walk-in'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Phone</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{phone || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Est. Wait</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">~{myToken * 10} min</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Date</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Dashed separator */}
              <div className="px-4 py-1">
                <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-600"></div>
              </div>

              {/* Footer - Clinic Address */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">📍 Near BL Public School, Village Pipra, Siwan</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Valid for today&apos;s session only</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={downloadTicket}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
              >
                📥 Download
              </button>
              <a
                href="/"
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
              >
                Website
              </a>
              <button
                onClick={() => { setMyToken(null); setMyPatientId(null); setPatientName(''); setPhone('') }}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                New Token
              </button>
            </div>
          </motion.div>
        ) : (
          /* Take Token Form */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="For WhatsApp notification"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                onClick={handleTakeToken}
                disabled={isJoining}
                className="w-full py-3.5 px-6 rounded-xl font-medium text-base bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-lg"
              >
                {isJoining ? '⏳ Getting Token...' : '🎟️ Take Token'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Token is valid for today&apos;s clinic session only
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
    <Footer />
    </div>
  )
}
