'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Payment Section — UPI payment options for consultations.
 * 
 * Features:
 * - UPI ID display with copy button
 * - UPI app deep links with original logos (GPay, PhonePe, Paytm, BHIM, etc.)
 * - Payment mode selection: Online (UPI) or Pay at Clinic (cash)
 * - WhatsApp share button for payment screenshot
 * - Consultation type pricing reference
 */

const UPI_ID = 'savitasinghunstoppable98@oksbi'
const WHATSAPP_NUMBER = '916204309476'

interface UpiApp {
  name: string
  logo: string
  scheme: string
  bgColor: string
}

const UPI_APPS: UpiApp[] = [
  {
    name: 'Google Pay',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png',
    scheme: 'gpay://upi/pay',
    bgColor: 'bg-white',
  },
  {
    name: 'PhonePe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png',
    scheme: 'phonepe://pay',
    bgColor: 'bg-[#5f259f]/5',
  },
  {
    name: 'Paytm',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png',
    scheme: 'paytmmp://pay',
    bgColor: 'bg-[#00BAF2]/5',
  },
  {
    name: 'BHIM',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png',
    scheme: 'upi://pay',
    bgColor: 'bg-white',
  },
  {
    name: 'Amazon Pay',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Amazon_Pay_logo.svg/512px-Amazon_Pay_logo.svg.png',
    scheme: 'amazonpay://pay',
    bgColor: 'bg-white',
  },
  {
    name: 'WhatsApp Pay',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png',
    scheme: 'whatsapp://pay',
    bgColor: 'bg-[#25D366]/5',
  },
]

const PRICING = [
  { label: 'Initial Consultation (In-Person)', amount: 300 },
  { label: 'Initial Consultation (Online)', amount: 200 },
  { label: 'Follow-up Visit', amount: 100 },
  { label: 'Monthly Remedy Kit', amount: 200 },
  { label: 'Online Consultation (30 min)', amount: 200 },
  { label: 'Video Consultation (20 min)', amount: 150 },
]

export function Payment() {
  const [copied, setCopied] = useState(false)
  const [paymentMode, setPaymentMode] = useState<'online' | 'cash'>('online')
  const [selectedAmount, setSelectedAmount] = useState<number>(300)

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function getUpiLink(scheme: string, amount: number) {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: 'Dr Savita Kumari',
      am: amount.toString(),
      cu: 'INR',
      tn: 'Consultation Fee',
    })
    return `${scheme}?${params.toString()}`
  }

  function getWhatsAppLink() {
    const message = encodeURIComponent(
      `Hi Dr. Savita, I have made a payment of ₹${selectedAmount} via UPI for my consultation. Please find the payment screenshot attached.`
    )
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  }

  return (
    <section id="payment" className="section-padding">
      <div className="container-content max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 md:p-8 rounded-2xl"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-fluid-h3 font-heading text-foreground mb-2">
              💳 Pay for Consultation
            </h2>
            <p className="text-foreground-muted text-fluid-body-sm">
              Secure payment via UPI or pay in cash at the clinic
            </p>
          </div>

          {/* Payment Mode Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-border mb-6">
            <button
              onClick={() => setPaymentMode('online')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                paymentMode === 'online'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background-secondary text-foreground-muted hover:text-foreground'
              }`}
            >
              📱 Pay Online (UPI)
            </button>
            <button
              onClick={() => setPaymentMode('cash')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                paymentMode === 'cash'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background-secondary text-foreground-muted hover:text-foreground'
              }`}
            >
              💵 Pay at Clinic (Cash/UPI)
            </button>
          </div>

          {paymentMode === 'online' ? (
            <>
              {/* Select Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Select Consultation Type
                </label>
                <select
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-background-secondary text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {PRICING.map((p) => (
                    <option key={p.label} value={p.amount}>
                      {p.label} — ₹{p.amount}
                    </option>
                  ))}
                </select>
              </div>

              {/* UPI ID Display */}
              <div className="mb-6 p-4 rounded-xl bg-background-secondary border border-border">
                <p className="text-xs text-foreground-muted mb-1 font-medium uppercase tracking-wide">
                  UPI ID
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm md:text-base font-mono text-foreground break-all">
                    {UPI_ID}
                  </code>
                  <button
                    onClick={copyUpiId}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      copied
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Amount Display */}
              <div className="text-center mb-6">
                <p className="text-sm text-foreground-muted">Amount to Pay</p>
                <p className="text-3xl font-bold text-primary">₹{selectedAmount}</p>
              </div>

              {/* UPI App Buttons */}
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground-secondary mb-3">
                  Pay using your preferred UPI app:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {UPI_APPS.map((app) => (
                    <a
                      key={app.name}
                      href={getUpiLink(app.scheme, selectedAmount)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 ${app.bgColor}`}
                    >
                      <img
                        src={app.logo}
                        alt={app.name}
                        className="w-10 h-10 object-contain"
                        loading="lazy"
                      />
                      <span className="text-[10px] text-foreground-muted text-center leading-tight font-medium">
                        {app.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Generic UPI Link (fallback) */}
              <div className="mb-6 text-center">
                <a
                  href={getUpiLink('upi://pay', selectedAmount)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-[#5f259f] text-white hover:bg-[#4a1d7a] transition-colors shadow-elevation-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Pay ₹{selectedAmount} via Any UPI App
                </a>
              </div>

              {/* Share Screenshot on WhatsApp */}
              <div className="pt-4 border-t border-border-light">
                <p className="text-sm text-foreground-muted text-center mb-3">
                  After payment, share the screenshot with Dr. Savita:
                </p>
                <div className="text-center">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors shadow-elevation-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Share Payment Screenshot on WhatsApp
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* Cash Payment Mode */
            <div className="text-center space-y-4">
              <div className="p-6 rounded-xl bg-background-secondary border border-border">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="text-3xl">🏥</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Pay at Clinic
                </h3>
                <p className="text-sm text-foreground-muted mb-4">
                  You can pay in <strong>cash</strong> or via <strong>UPI</strong> at the clinic during your visit.
                </p>

                {/* Pricing Table */}
                <div className="text-left space-y-2 mt-4 pt-4 border-t border-border-light">
                  {PRICING.map((p) => (
                    <div key={p.label} className="flex items-center justify-between text-sm">
                      <span className="text-foreground-muted">{p.label}</span>
                      <span className="font-medium text-foreground">₹{p.amount}</span>
                    </div>
                  ))}
                </div>

                {/* Note about Govt Clinic */}
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    🆓 <strong>FREE treatment</strong> available at PHC Khujhwa, Siwan (Govt. Clinic) for all patients.
                  </p>
                </div>
              </div>

              {/* Option to still pay online */}
              <p className="text-sm text-foreground-muted">
                Want to pay in advance?{' '}
                <button
                  onClick={() => setPaymentMode('online')}
                  className="text-primary font-medium hover:underline"
                >
                  Pay Online via UPI →
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
