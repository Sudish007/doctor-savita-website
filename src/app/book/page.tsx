'use client'

import AppointmentForm from "@/components/forms/AppointmentForm";
import { Navigation } from "@/components/layout/Navigation";

/**
 * Standalone Appointment Booking Page — /book
 * Dedicated page for booking appointments, shareable link.
 */
export default function BookPage() {
  return (
    <>
      <Navigation />
      <div className="pt-16 md:pt-20 pb-24 min-h-screen bg-background">
        <div className="container-content">
          <AppointmentForm />
        </div>
      </div>
    </>
  );
}
