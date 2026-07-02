'use client'

import { motion } from 'framer-motion'

/**
 * Learn Teaser — compact homepage section promoting online teaching & study materials.
 * Links to /learn for full details.
 */

export function LearnTeaser() {
  return (
    <section className="section-padding">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-8 rounded-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left: Info */}
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-accent-light text-accent-foreground mb-2">
                For Medical Students
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Learn with Dr. Savita
              </h2>
              <p className="text-foreground-muted text-sm mb-4">
                Online classes, doubt sessions & exam prep for BHMS students. PDF notes & study materials available.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-foreground-muted">
                <span className="px-2 py-1 rounded-lg bg-primary/5 border border-primary/10">📚 Materia Medica</span>
                <span className="px-2 py-1 rounded-lg bg-primary/5 border border-primary/10">📖 Organon</span>
                <span className="px-2 py-1 rounded-lg bg-primary/5 border border-primary/10">🎯 Repertory</span>
                <span className="px-2 py-1 rounded-lg bg-primary/5 border border-primary/10">🏥 Clinical</span>
              </div>
            </div>

            {/* Right: Pricing + CTA */}
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="text-sm text-foreground-muted">
                <p>Classes from <span className="font-bold text-primary text-lg">₹200</span>/session</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/learn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  Explore Courses →
                </a>
                <a
                  href="https://wa.me/916204309476?text=Hi%20Dr.%20Savita%2C%20I%20am%20interested%20in%20your%20online%20classes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  📩 Enquire
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
