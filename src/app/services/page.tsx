'use client'
import { Services } from '@/components/sections/Services'
import { Navigation } from "@/components/layout/Navigation"

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 md:pt-20 pb-24 min-h-screen bg-background">
        <Services />
      </div>
    </>
  )
}
