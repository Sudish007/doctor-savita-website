'use client'
import { About } from '@/components/sections/About'
import { Navigation } from "@/components/layout/Navigation"

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 md:pt-20 pb-24 min-h-screen bg-background">
        <About />
      </div>
    </>
  )
}
