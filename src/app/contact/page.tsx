'use client'
import { Navigation } from '@/components/layout/Navigation'
import { Contact } from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 min-h-screen bg-background">
        <Contact />
      </div>
      <Footer />
    </>
  )
}
