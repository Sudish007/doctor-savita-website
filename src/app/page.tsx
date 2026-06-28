import { Navigation } from "@/components/layout/Navigation";
import ScrollProgress from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { Services } from "@/components/sections/Services";
import { Credentials } from "@/components/sections/Credentials";
import { Testimonials } from "@/components/sections/Testimonials";
import { RemedyOfTheDay } from "@/components/sections/RemedyOfTheDay";
import { BodyMap } from "@/components/sections/BodyMap";
import { LiveQueue } from "@/components/sections/LiveQueue";
import { CostEstimator } from "@/components/sections/CostEstimator";
import { SeasonalAlert } from "@/components/sections/SeasonalAlert";
import { HealthTipsVideos } from "@/components/sections/HealthTipsVideos";
import { Contact } from "@/components/sections/Contact";
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
        <PhotoGallery />
        <Services />
        <Credentials />
        <Testimonials />
        <RemedyOfTheDay />
        <BodyMap />
        <LiveQueue />
        <CostEstimator />
        <HealthTipsVideos />
        <AppointmentForm />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
