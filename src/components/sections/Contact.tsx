'use client'

import { motion } from 'framer-motion'

import { ContactForm } from '@/components/forms/ContactForm'

/**
 * Contact Section - Displays clinic info, map, phone numbers, operating hours, and contact form.
 *
 * Layout: Responsive 2-column (map + info on left, form on right)
 * - Clinic address: Primary Health Centre, Khujhwa, Siwan, Bihar
 * - Phone numbers as clickable tel: links (Father: 9800206704, Brother: 9971585873)
 * - WhatsApp contact button for 9971585873
 * - Google Maps embed (iframe) for Khujhwa, Siwan, Bihar
 * - Operating hours: Mon-Sat 9AM-5PM, Closed on Sundays
 * - ContactForm component
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8
 */

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Contact() {
  return (
    <section id="contact" className="section-padding nature-overlay">
      <div className="container-content">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-fluid-h2 font-heading text-foreground mb-3">
            Contact Us
          </h2>
          <p className="text-foreground-muted text-fluid-body max-w-2xl mx-auto">
            Visit our clinic or reach out through any of the channels below.
          </p>
        </motion.div>

        {/* 2-column layout: Left (map + info) | Right (form) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column — Map + Clinic Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Google Maps Embed */}
            <motion.div variants={fadeUp} className="glass-card overflow-hidden rounded-2xl">
              <iframe
                title="Clinic Location - Primary Health Centre, Khujhwa, Siwan, Bihar"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14349.146542766793!2d84.3!3d26.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3993a1b3d5b9c8c1%3A0x2e6c8c7a6f3c8f0a!2sKhujhwa%2C%20Siwan%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </motion.div>

            {/* Clinic Information Card */}
            <motion.div variants={fadeUp} className="glass-card p-6 md:p-7 space-y-5">
              {/* Address */}
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5" aria-hidden="true">📍</span>
                <div>
                  <h4 className="text-fluid-body font-semibold text-foreground mb-0.5">
                    Saubhagya Clinic (Private)
                  </h4>
                  <p className="text-foreground-muted text-fluid-body-sm">
                    Near BL Public School, Village Pipra,
                  </p>
                  <p className="text-foreground-muted text-fluid-body-sm">
                    Post Khedhay, PS Andar, Siwan, Bihar
                  </p>
                  <p className="text-foreground-muted text-fluid-caption mt-1">
                    <span className="font-medium text-foreground">Timing:</span> 6–8 AM & 3–6 PM (Weekdays) | Sun: 10 AM–5 PM
                  </p>
                  <h4 className="text-fluid-body font-semibold text-foreground mb-0.5 mt-3">
                    PHC Khujhwa (Govt. — Free Treatment)
                  </h4>
                  <p className="text-foreground-muted text-fluid-body-sm">
                    Primary Health Centre, Khujhwa, Siwan, Bihar
                  </p>
                  <p className="text-foreground-muted text-fluid-caption mt-1">
                    <span className="font-medium text-foreground">Timing:</span> 9 AM–2 PM (Weekdays) | Sunday Closed
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5" aria-hidden="true">📞</span>
                <div>
                  <h4 className="text-fluid-body font-semibold text-foreground mb-1">
                    Phone
                  </h4>
                  <a
                    href="tel:+916204309476"
                    className="flex items-center gap-2 text-fluid-body-sm text-foreground-muted hover:text-primary transition-colors touch-target"
                  >
                    <span className="font-medium text-foreground">+91 62043 09476</span>
                  </a>
                </div>
              </div>

              {/* Social Links with logos */}
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5" aria-hidden="true">🔗</span>
                <div>
                  <h4 className="text-fluid-body font-semibold text-foreground mb-2">
                    Connect With Us
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://www.instagram.com/homoeohelpline4u/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      Instagram
                    </a>
                    <a href="https://t.me/homoeohelpline" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0088CC] text-white text-xs font-medium hover:opacity-90 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                      Telegram
                    </a>
                    <a href="https://wa.me/916204309476" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-medium hover:opacity-90 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5" aria-hidden="true">🕘</span>
                <div>
                  <h4 className="text-fluid-body font-semibold text-foreground mb-1">
                    Operating Hours
                  </h4>
                  <div className="space-y-1.5 text-fluid-body-sm text-foreground-muted">
                    <div>
                      <p className="font-medium text-foreground text-xs">Saubhagya Clinic (Private)</p>
                      <p>Weekdays: 6:00–8:00 AM & 3:00–6:00 PM</p>
                      <p>Sunday: 10:00 AM – 5:00 PM</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-xs">PHC Khujhwa (Govt.)</p>
                      <p>Weekdays: 9:00 AM – 2:00 PM</p>
                      <p className="text-destructive/80 font-medium">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column — Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
