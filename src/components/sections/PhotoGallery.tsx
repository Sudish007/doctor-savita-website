'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

/**
 * Photo Gallery — Scrollable carousel with lightbox expansion.
 */

const GALLERY_IMAGES = [
  { src: '/images/gallery/gallery-1.jpeg', alt: 'Dr. Savita Kumari - Photo 1' },
  { src: '/images/gallery/gallery-2.jpeg', alt: 'Dr. Savita Kumari - Photo 2' },
  { src: '/images/gallery/gallery-3.jpeg', alt: 'Dr. Savita Kumari - Photo 3' },
  { src: '/images/gallery/gallery-4.jpeg', alt: 'Dr. Savita Kumari - Photo 4' },
  { src: '/images/gallery/gallery-5.jpeg', alt: 'Dr. Savita Kumari - Photo 5' },
  { src: '/images/gallery/gallery-6.jpeg', alt: 'Dr. Savita Kumari - Photo 6' },
  { src: '/images/gallery/gallery-7.jpeg', alt: 'Dr. Savita Kumari - Photo 7' },
  { src: '/images/gallery/gallery-8.jpeg', alt: 'Dr. Savita Kumari - Photo 8' },
  { src: '/images/gallery/gallery-9.jpeg', alt: 'Dr. Savita Kumari - Photo 9' },
  { src: '/images/gallery/gallery-10.jpeg', alt: 'Dr. Savita Kumari - Photo 10' },
]

export function PhotoGallery() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [prefersReducedMotion])

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % GALLERY_IMAGES.length : null)
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null)

  return (
    <section id="gallery" className="section-padding" aria-labelledby="gallery-heading">
      <div className="container-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 id="gallery-heading" className="text-fluid-h2 font-heading text-foreground mb-3">
            Photo Gallery
          </h2>
          <p className="text-foreground-muted max-w-lg mx-auto">
            Glimpses of Dr. Savita Kumari&apos;s professional journey. Click any photo to view full size.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Arrows */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full items-center justify-center bg-card/90 backdrop-blur-sm border border-card-border shadow-lg hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full items-center justify-center bg-card/90 backdrop-blur-sm border border-card-border shadow-lg hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          {/* Scrollable images */}
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-2 py-4"
          >
            {GALLERY_IMAGES.map((img, index) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="flex-shrink-0 snap-center cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative w-[280px] h-[360px] md:w-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-elevation-3 border border-card-border group bg-muted">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 280px, 300px"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Expand icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {/* Previous */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-[90vw] h-[80vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={GALLERY_IMAGES[lightboxIndex].src}
                alt={GALLERY_IMAGES[lightboxIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {GALLERY_IMAGES.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
