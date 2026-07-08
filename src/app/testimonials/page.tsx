'use client'
import { Testimonials } from '@/components/sections/Testimonials'
import { Navigation } from "@/components/layout/Navigation"

export default function TestimonialsPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 md:pt-20 pb-24 min-h-screen bg-background">
        <Testimonials />
      </div>
    </>
  )
}
