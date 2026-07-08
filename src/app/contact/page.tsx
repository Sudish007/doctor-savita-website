'use client'
import { Contact } from '@/components/sections/Contact'
import { Navigation } from "@/components/layout/Navigation"

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 md:pt-20 pb-24 min-h-screen bg-background">
        <Contact />
      </div>
    </>
  )
}
