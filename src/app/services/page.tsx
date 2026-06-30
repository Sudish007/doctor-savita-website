'use client'
import { Navigation } from '@/components/layout/Navigation'
import { Services } from '@/components/sections/Services'
import Footer from '@/components/layout/Footer'

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 min-h-screen bg-background">
        <Services />
      </div>
      <Footer />
    </>
  )
}
