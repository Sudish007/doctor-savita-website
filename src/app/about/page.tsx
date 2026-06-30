'use client'
import { Navigation } from '@/components/layout/Navigation'
import { About } from '@/components/sections/About'
import Footer from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 min-h-screen bg-background">
        <About />
      </div>
      <Footer />
    </>
  )
}
