import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout/Navigation";
import ScrollProgress from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { LiveQueue } from "@/components/sections/LiveQueue";
import { Payment } from "@/components/sections/Payment";
import { SeasonalAlert } from "@/components/sections/SeasonalAlert";
import { Contact } from "@/components/sections/Contact";
import ChatWidget from "@/components/chatbot/ChatWidget";
import Footer from "@/components/layout/Footer";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { QueueBadge } from "@/components/shared/QueueBadge";
import { TimeGreeting } from "@/components/shared/TimeGreeting";
import { ClinicStatus } from "@/components/shared/ClinicStatus";
import { EmergencyButton } from "@/components/shared/EmergencyButton";
import { ShareApp } from "@/components/shared/ShareApp";
import { FeedbackCard } from "@/components/shared/FeedbackCard";
import { AppointmentCountdown } from "@/components/shared/AppointmentCountdown";

// Lazy-loaded below-fold sections
const CostEstimator = dynamic(() => import("@/components/sections/CostEstimator").then(mod => ({ default: mod.CostEstimator })), { ssr: true, loading: () => null });
const PhotoGallery = dynamic(() => import("@/components/sections/PhotoGallery").then(mod => ({ default: mod.PhotoGallery })), { ssr: true, loading: () => null });
const HealthTipsVideos = dynamic(() => import("@/components/sections/HealthTipsVideos").then(mod => ({ default: mod.HealthTipsVideos })), { ssr: true, loading: () => null });
const Credentials = dynamic(() => import("@/components/sections/Credentials").then(mod => ({ default: mod.Credentials })), { ssr: true, loading: () => null });
const LearnSection = dynamic(() => import("@/components/sections/LearnSection").then(mod => ({ default: mod.LearnSection })), { ssr: true, loading: () => null });
const RemedyOfTheDay = dynamic(() => import("@/components/sections/RemedyOfTheDay").then(mod => ({ default: mod.RemedyOfTheDay })), { ssr: true, loading: () => null });

export default function HomePage() {
  return (
    <>
      <Navigation />
      <ScrollProgress />
      <div className="pt-16">
        <SeasonalAlert />
        {/* Personalized greeting + clinic status (mobile only) */}
        <div className="md:hidden">
          <TimeGreeting />
          <AppointmentCountdown />
          <div className="px-4 pb-3 flex items-center gap-2">
            <ClinicStatus />
          </div>
        </div>
        <Hero />
        {/* Live queue badge below hero */}
        <div className="flex justify-center py-3 md:hidden">
          <QueueBadge />
        </div>
        <About />
        <LiveQueue />
        <AppointmentForm />
        <Payment />
        <Services />
        <CostEstimator />
        <PhotoGallery />
        <Testimonials />
        {/* Emergency contact + Share + Feedback (mobile) */}
        <div className="px-4 py-6 space-y-4 md:hidden">
          <EmergencyButton />
          <FeedbackCard />
          <div className="flex justify-center">
            <ShareApp />
          </div>
        </div>
        <Credentials />
        <LearnSection />
        <RemedyOfTheDay />
        <HealthTipsVideos />
        <Contact />
        <Footer />
      </div>
      <ChatWidget />
    </>
  );
}
