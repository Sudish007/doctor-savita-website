'use client'
import { Navigation } from '@/components/layout/Navigation'
import { Credentials } from '@/components/sections/Credentials'
import Footer from '@/components/layout/Footer'

export default function CredentialsPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 min-h-screen bg-background">
        <Credentials />
      </div>
      <Footer />
    </>
  )
}
