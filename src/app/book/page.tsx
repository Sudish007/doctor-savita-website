import { Navigation } from "@/components/layout/Navigation";
import AppointmentForm from "@/components/forms/AppointmentForm";
import Footer from "@/components/layout/Footer";

/**
 * Standalone Appointment Booking Page — /book
 * Dedicated page for booking appointments, shareable link.
 */
export default function BookPage() {
  return (
    <>
      <Navigation />
      <div className="pt-20 pb-8 min-h-screen bg-background">
        <div className="container-content">
          <div className="text-center mb-6">
            <a href="/" className="text-sm text-primary hover:underline mb-2 inline-block">← Back to website</a>
          </div>
          <AppointmentForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
