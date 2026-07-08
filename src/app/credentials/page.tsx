'use client'
import { Credentials } from '@/components/sections/Credentials'
import { Navigation } from "@/components/layout/Navigation"

export default function CredentialsPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 md:pt-20 pb-24 min-h-screen bg-background">
        <Credentials />
      </div>
    </>
  )
}
