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
import { Contact } from "@/components/sections/Contact";
import ChatWidget from "@/components/chatbot/ChatWidget";
import Footer from "@/components/layout/Footer";
import AppointmentForm from "@/components/forms/AppointmentForm";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <ScrollProgress />
      <div className="pt-16">
        <SeasonalAlert />
        <Hero />
        <About />
        <LiveQueue />
        <AppointmentForm />
        <Payment />
        <Services />
        <CostEstimator />
        <PhotoGallery />
        <Testimonials />
        <Credentials />
        <RemedyOfTheDay />
        <HealthTipsVideos />
        <Contact />
        <Footer />
      </div>
      <ChatWidget />
    </>
  );
}
