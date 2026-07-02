'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { Navigation } from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const UPI_ID = 'savitasinghunstoppable98@oksbi'
const WHATSAPP_NUMBER = '916204309476'

interface Material {
  id: string
  title: string
  description: string
  subject: string
  price: number
  is_published: boolean
  created_at: string
}

const SUBJECTS = ['All', 'Materia Medica', 'Organon', 'Repertory', 'Clinical Practice', 'Exam Tips', 'General']

export default function LearnPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [buyingId, setBuyingId] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(500)

  useEffect(() => {
    fetchMaterials()
  }, [])

  async function fetchMaterials() {
    if (!sb) { setLoading(false); return }
    try {
      const { data } = await sb
        .from('study_materials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      if (data) setMaterials(data as Material[])
    } catch { /* ignore */ }
    setLoading(false)
  }

  const filtered = selectedSubject === 'All'
    ? materials
    : materials.filter(m => m.subject === selectedSubject)

  function getWhatsAppBuyLink(material: Material) {
    const msg = material.price > 0
      ? `Hi Dr. Savita, I want to buy "${material.title}" (₹${material.price}). I have made the payment. Please share the PDF.`
      : `Hi Dr. Savita, I would like to get the free material "${material.title}". Please share.`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 pt-16 pb-12 bg-background">
        <div className="container-content">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10 md:py-14"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-accent-light text-accent-foreground mb-3">
              For Medical Students
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Learn with Dr. Savita
            </h1>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              Online teaching, exam preparation guidance, and study materials for BHMS students and AYUSH exam aspirants.
            </p>
          </motion.div>

          {/* Teaching Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 rounded-2xl mb-10"
          >
            <h2 className="text-xl font-bold text-foreground mb-2">📖 Online Teaching Services</h2>
            <p className="text-sm text-foreground-muted mb-6">For BHMS students, AYUSH exam aspirants & homeopathy learners</p>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-border bg-background-secondary">
                <h3 className="font-semibold text-foreground mb-1">📚 Subject Classes</h3>
                <p className="text-xs text-foreground-muted mb-2">Materia Medica, Organon, Repertory, Clinical Practice</p>
                <p className="text-2xl font-bold text-primary mb-1">₹500<span className="text-xs font-normal text-foreground-muted">/month</span></p>
                <p className="text-[10px] text-foreground-muted">Weekly live sessions + recorded access</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background-secondary">
                <h3 className="font-semibold text-foreground mb-1">🎯 Doubt Session</h3>
                <p className="text-xs text-foreground-muted mb-2">1-on-1 personal doubt clearing session</p>
                <p className="text-2xl font-bold text-primary mb-1">₹200<span className="text-xs font-normal text-foreground-muted">/session</span></p>
                <p className="text-[10px] text-foreground-muted">30 min video call, any subject</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background-secondary">
                <h3 className="font-semibold text-foreground mb-1">🏆 Exam Prep Pack</h3>
                <p className="text-xs text-foreground-muted mb-2">Complete exam guidance + notes + mock tests</p>
                <p className="text-2xl font-bold text-primary mb-1">₹1500<span className="text-xs font-normal text-foreground-muted">/course</span></p>
                <p className="text-[10px] text-foreground-muted">Full syllabus coverage + exam tricks</p>
              </div>
            </div>

            {/* What you get */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="font-semibold text-foreground mb-2">📚 Subjects Covered</h3>
                <ul className="text-sm text-foreground-muted space-y-1">
                  <li>• Materia Medica (drugs & their actions)</li>
                  <li>• Organon of Medicine (principles)</li>
                  <li>• Repertory (symptom-based prescribing)</li>
                  <li>• Clinical Practice & Case Taking</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="font-semibold text-foreground mb-2">🎯 What You Get</h3>
                <ul className="text-sm text-foreground-muted space-y-1">
                  <li>• Live online classes via Zoom/Google Meet</li>
                  <li>• Doubt clearing sessions (1-on-1)</li>
                  <li>• Exam tips, tricks & shortcuts</li>
                  <li>• PDF notes & study materials</li>
                </ul>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Dr. Savita, I am interested in your online teaching classes. Please share details about schedule, fees, and subjects.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors"
              >
                📩 Enquire on WhatsApp
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Dr. Savita, I want to book a doubt clearing session. Please share available time slots.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                📅 Book a Class/Session
              </a>
              <button
                onClick={() => setShowPayment(!showPayment)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                💳 Pay for Classes
              </button>
            </div>

            {/* Payment Section */}
            {showPayment && (
              <div className="mt-6 p-5 rounded-xl border border-border bg-background-secondary">
                <h4 className="font-semibold text-foreground mb-4">Pay via UPI</h4>
                
                {/* Full width layout */}
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-start mb-4">
                  {/* QR */}
                  <img src="/images/upi-qr.jpeg" alt="UPI QR Code" className="w-32 h-32 rounded-lg border border-border" />
                  
                  {/* UPI ID + Pricing */}
                  <div>
                    <p className="text-[10px] text-foreground-muted mb-0.5">UPI ID</p>
                    <code className="text-sm font-mono text-foreground block mb-3">{UPI_ID}</code>
                    <p className="text-xs font-medium text-foreground mb-1">Select and pay:</p>
                    <div className="grid grid-cols-3 gap-2 text-xs text-foreground-muted">
                      <button onClick={() => setSelectedAmount(500)} className={`p-2 rounded-lg border text-center transition-colors ${selectedAmount === 500 ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border bg-background hover:border-primary'}`}>Classes<br/><strong className="text-foreground">₹500/mo</strong></button>
                      <button onClick={() => setSelectedAmount(200)} className={`p-2 rounded-lg border text-center transition-colors ${selectedAmount === 200 ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border bg-background hover:border-primary'}`}>Doubt<br/><strong className="text-foreground">₹200</strong></button>
                      <button onClick={() => setSelectedAmount(1500)} className={`p-2 rounded-lg border text-center transition-colors ${selectedAmount === 1500 ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border bg-background hover:border-primary'}`}>Exam Pack<br/><strong className="text-foreground">₹1500</strong></button>
                    </div>
                    <p className="text-xs text-primary font-medium mt-2">Amount: ₹{selectedAmount}</p>
                  </div>

                  {/* UPI Apps */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { name: 'GPay', scheme: 'gpay://upi/pay', icon: 'https://img.icons8.com/color/48/google-pay-india.png' },
                      { name: 'PhonePe', scheme: 'phonepe://pay', icon: 'https://img.icons8.com/color/48/phone-pe.png' },
                      { name: 'Paytm', scheme: 'paytmmp://pay', icon: 'https://img.icons8.com/color/48/paytm.png' },
                      { name: 'BHIM', scheme: 'upi://pay', icon: 'https://img.icons8.com/color/48/bhim.png' },
                      { name: 'Amazon', scheme: 'amazonpay://pay', icon: 'https://img.icons8.com/color/48/amazon.png' },
                      { name: 'WA Pay', scheme: 'whatsapp://pay', icon: 'https://img.icons8.com/color/48/whatsapp--v1.png' },
                    ].map(app => (
                      <a key={app.name} href={`${app.scheme}?pa=${UPI_ID}&pn=Dr%20Savita&am=${selectedAmount}&cu=INR&tn=Online%20Classes`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-border hover:border-primary transition-all" title={app.name}>
                        <img src={app.icon} alt={app.name} className="w-6 h-6 object-contain" loading="eager" />
                        <span className="text-[7px] text-foreground-muted">{app.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Share Proof */}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Dr. Savita, I have paid for online classes. Please find payment screenshot attached.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors"
                >
                  📤 Share Payment Proof on WhatsApp
                </a>
              </div>
            )}
          </motion.div>

          {/* Study Materials Store */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-2">📝 Study Materials & Notes</h2>
            <p className="text-foreground-muted text-sm mb-4">Download PDFs, notes, and exam tricks. Pay via UPI and receive on WhatsApp.</p>

            {/* Subject Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {SUBJECTS.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedSubject === sub
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground-muted hover:text-foreground'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Materials Grid */}
          {loading ? (
            <p className="text-center text-foreground-muted py-8">Loading materials...</p>
          ) : filtered.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center">
              <p className="text-3xl mb-3">📚</p>
              <p className="text-foreground-muted">No materials available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(material => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-xl p-5 flex flex-col"
                >
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-light text-accent-foreground mb-2 self-start">
                    {material.subject}
                  </span>
                  <h3 className="font-semibold text-foreground mb-1">{material.title}</h3>
                  <p className="text-sm text-foreground-muted mb-4 flex-1">{material.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold ${material.price > 0 ? 'text-primary' : 'text-emerald-600'}`}>
                      {material.price > 0 ? `₹${material.price}` : 'FREE'}
                    </span>

                    {buyingId === material.id ? (
                      /* Payment view */
                      <div className="flex gap-2">
                        <a
                          href={getWhatsAppBuyLink(material)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors"
                        >
                          Send Proof
                        </a>
                        <button
                          onClick={() => setBuyingId(null)}
                          className="px-2 py-1.5 rounded-lg text-xs text-foreground-muted hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => material.price > 0 ? setBuyingId(material.id) : window.open(getWhatsAppBuyLink(material), '_blank')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          material.price > 0
                            ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {material.price > 0 ? '💳 Buy' : '📥 Get Free'}
                      </button>
                    )}
                  </div>

                  {/* Payment details when buying */}
                  {buyingId === material.id && material.price > 0 && (
                    <div className="mt-3 pt-3 border-t border-border-light space-y-2">
                      <p className="text-xs text-foreground-muted">Pay ₹{material.price} via UPI:</p>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-background-secondary border border-border">
                        <code className="text-xs font-mono flex-1 break-all">{UPI_ID}</code>
                      </div>
                      <div className="flex justify-center">
                        <img src="/images/upi-qr.jpeg" alt="UPI QR" className="w-24 h-24 rounded-lg" />
                      </div>
                      <a
                        href={getWhatsAppBuyLink(material)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2 rounded-lg text-center text-xs font-medium bg-[#25D366] text-white"
                      >
                        📤 Share Proof & Get PDF
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
