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

              {/* WhatsApp Contact */}
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5" aria-hidden="true">💬</span>
                <div>
                  <h4 className="text-fluid-body font-semibold text-foreground mb-1.5">
                    WhatsApp
                  </h4>
                  <a
                    href="https://wa.me/916204309476"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-medium text-sm hover:bg-[#1EBE57] transition-colors touch-target shadow-sm"
                  >
                    <WhatsAppIcon />
                    Chat on WhatsApp
                  </a>
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

/** WhatsApp brand icon SVG */
function WhatsAppIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default Contact
