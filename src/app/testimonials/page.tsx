'use client'
import { Navigation } from '@/components/layout/Navigation'
import { Testimonials } from '@/components/sections/Testimonials'
import Footer from '@/components/layout/Footer'

export default function TestimonialsPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 min-h-screen bg-background">
        <Testimonials />
      </div>
      <Footer />
    </>
  )
}
