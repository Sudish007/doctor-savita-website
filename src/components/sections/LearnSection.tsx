'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

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
}

const SUBJECTS = ['All', 'Materia Medica', 'Organon', 'Repertory', 'Clinical Practice', 'Exam Tips', 'General']

export function LearnSection() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [buyingId, setBuyingId] = useState<string | null>(null)

  useEffect(() => {
    if (!sb) return
    sb.from('study_materials').select('*').eq('is_published', true).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setMaterials(data as Material[]) })
  }, [])

  const filtered = selectedSubject === 'All' ? materials : materials.filter(m => m.subject === selectedSubject)

  function getWhatsAppBuyLink(material: Material) {
    const msg = material.price > 0
      ? `Hi Dr. Savita, I want to buy "${material.title}" (₹${material.price}). I have made the payment. Please share the PDF.`
      : `Hi Dr. Savita, I would like to get the free material "${material.title}". Please share.`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
  }

  return (
    <section className="section-padding" id="learn">
      <div className="container-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-accent-light text-accent-foreground mb-2">
            For Medical Students
          </span>
          <h2 className="text-fluid-h2 font-heading text-foreground mb-2">
            Learn with Dr. Savita
          </h2>
          <p className="text-foreground-muted max-w-2xl mx-auto text-sm">
            Online teaching, exam preparation & study materials for BHMS students and AYUSH exam aspirants.
          </p>
        </motion.div>

        {/* Teaching Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-8 rounded-2xl mb-8"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">📖 Online Teaching Services</h3>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-border bg-background-secondary text-center">
              <p className="text-2xl font-bold text-primary">₹500</p>
              <p className="text-xs text-foreground-muted">/month</p>
              <p className="font-medium text-foreground text-sm mt-2">Subject Classes</p>
              <p className="text-[10px] text-foreground-muted mt-1">Weekly live sessions + recordings</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background-secondary text-center">
              <p className="text-2xl font-bold text-primary">₹200</p>
              <p className="text-xs text-foreground-muted">/session</p>
              <p className="font-medium text-foreground text-sm mt-2">Doubt Session</p>
              <p className="text-[10px] text-foreground-muted mt-1">30 min 1-on-1 video call</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background-secondary text-center">
              <p className="text-2xl font-bold text-primary">₹1500</p>
              <p className="text-xs text-foreground-muted">/course</p>
              <p className="font-medium text-foreground text-sm mt-2">Exam Prep Pack</p>
              <p className="text-[10px] text-foreground-muted mt-1">Full syllabus + notes + mocks</p>
            </div>
          </div>

          {/* Subjects */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="px-2 py-1 rounded-lg text-xs bg-primary/5 border border-primary/10 text-foreground-muted">📚 Materia Medica</span>
            <span className="px-2 py-1 rounded-lg text-xs bg-primary/5 border border-primary/10 text-foreground-muted">📖 Organon</span>
            <span className="px-2 py-1 rounded-lg text-xs bg-primary/5 border border-primary/10 text-foreground-muted">🎯 Repertory</span>
            <span className="px-2 py-1 rounded-lg text-xs bg-primary/5 border border-primary/10 text-foreground-muted">🏥 Clinical Practice</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Dr. Savita, I am interested in your online teaching classes.')}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-sm font-medium bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors">
              📩 Enquire on WhatsApp
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Dr. Savita, I want to book a doubt clearing session.')}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-colors">
              📅 Book a Session
            </a>
          </div>
        </motion.div>

        {/* Study Materials */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">📝 Study Materials & Notes</h3>
          <p className="text-foreground-muted text-sm mb-4">Pay via UPI, receive PDF on WhatsApp.</p>

          {/* Subject Filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            {SUBJECTS.map(sub => (
              <button key={sub} onClick={() => setSelectedSubject(sub)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedSubject === sub ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground-muted hover:text-foreground'}`}>
                {sub}
              </button>
            ))}
          </div>

          {/* Materials Grid */}
          {filtered.length === 0 ? (
            <div className="glass-card p-6 rounded-xl text-center">
              <p className="text-foreground-muted text-sm">No materials available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(material => (
                <div key={material.id} className="glass-card rounded-xl p-4 flex flex-col">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-light text-accent-foreground mb-2 self-start">{material.subject}</span>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{material.title}</h4>
                  <p className="text-xs text-foreground-muted mb-3 flex-1">{material.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${material.price > 0 ? 'text-primary' : 'text-emerald-600'}`}>
                      {material.price > 0 ? `₹${material.price}` : 'FREE'}
                    </span>
                    {buyingId === material.id ? (
                      <div className="flex gap-1">
                        <a href={getWhatsAppBuyLink(material)} target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded text-[10px] font-medium bg-[#25D366] text-white">Send Proof</a>
                        <button onClick={() => setBuyingId(null)} className="px-2 py-1 rounded text-[10px] text-foreground-muted">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => material.price > 0 ? setBuyingId(material.id) : window.open(getWhatsAppBuyLink(material), '_blank')} className={`px-3 py-1 rounded text-xs font-medium ${material.price > 0 ? 'bg-primary text-primary-foreground' : 'bg-emerald-600 text-white'}`}>
                        {material.price > 0 ? '💳 Buy' : '📥 Get Free'}
                      </button>
                    )}
                  </div>
                  {buyingId === material.id && material.price > 0 && (
                    <div className="mt-3 pt-3 border-t border-border-light space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-background-secondary border border-border">
                        <code className="text-[10px] font-mono flex-1 break-all">{UPI_ID}</code>
                      </div>
                      <div className="flex justify-center"><img src="/images/upi-qr.jpeg" alt="UPI QR" className="w-20 h-20 rounded" /></div>
                      <a href={getWhatsAppBuyLink(material)} target="_blank" rel="noopener noreferrer" className="block w-full py-1.5 rounded text-center text-[10px] font-medium bg-[#25D366] text-white">📤 Share Proof & Get PDF</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
