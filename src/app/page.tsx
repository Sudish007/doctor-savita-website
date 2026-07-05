import { Navigation } from "@/components/layout/Navigation";
import ScrollProgress from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { Services } from "@/components/sections/Services";
import { Credentials } from "@/components/sections/Credentials";
import { Testimonials } from "@/components/sections/Testimonials";
import { RemedyOfTheDay } from "@/components/sections/RemedyOfTheDay";
import { LiveQueue } from "@/components/sections/LiveQueue";
import { CostEstimator } from "@/components/sections/CostEstimator";
import { Payment } from "@/components/sections/Payment";
import { SeasonalAlert } from "@/components/sections/SeasonalAlert";
import { HealthTipsVideos } from "@/components/sections/HealthTipsVideos";
import { LearnSection } from "@/components/sections/LearnSection";
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
