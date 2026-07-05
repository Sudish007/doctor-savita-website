import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dr. Savita Kumari | Homeopathic Doctor, Siwan Bihar",
    template: "%s | Dr. Savita Kumari",
  },
  description:
    "Dr. Savita Kumari (BHMS) - Medical Officer, AYUSH Dept., Govt. of Bihar. Expert homeopathic treatment for chronic diseases, skin disorders, women's health, child care. Book appointment online. Saubhagya Multispeciality Clinic, Siwan.",
  keywords: ["homeopathy", "homeopathic doctor", "Siwan", "Bihar", "AYUSH", "BHMS", "Dr Savita", "natural treatment", "homoeopathy", "appointment booking", "online consultation"],
  authors: [{ name: "Dr. Savita Kumari" }],
  creator: "Dr. Savita Kumari",
  metadataBase: new URL("https://drsavitak.netlify.app"),
  openGraph: {
    title: "Dr. Savita Kumari (BHMS) | Homeopathic Medical Officer",
    description: "Expert homeopathic treatment in Siwan, Bihar. Book appointment online for skin, digestive, respiratory, women's health, child care. Free treatment at Govt. clinic.",
    url: "https://drsavitak.netlify.app",
    siteName: "Dr. Savita Kumari - Saubhagya Multispeciality Clinic",
    images: [
      {
        url: "/images/dr-savita-profile.jpg",
        width: 600,
        height: 600,
        alt: "Dr. Savita Kumari - Homeopathic Medical Officer, Siwan Bihar",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Savita Kumari | Homeopathic Doctor",
    description: "Book appointment for expert homeopathic treatment in Siwan, Bihar.",
    images: ["/images/dr-savita-profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://drsavitak.netlify.app",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Physician",
              name: "Dr. Savita Kumari",
              description: "Homeopathic Medical Officer (BHMS), AYUSH Department, Government of Bihar. Expert in chronic diseases, skin disorders, women's health, child care.",
              url: "https://drsavitak.netlify.app",
              image: "https://drsavitak.netlify.app/images/dr-savita-profile.jpg",
              telephone: "+916204309476",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Village Pipra, Post Khedhay, PS Andar",
                addressLocality: "Siwan",
                addressRegion: "Bihar",
                addressCountry: "IN",
              },
              medicalSpecialty: "Homeopathy",
              availableService: [
                { "@type": "MedicalProcedure", name: "Homeopathic Consultation" },
                { "@type": "MedicalProcedure", name: "Online Video Consultation" },
                { "@type": "MedicalProcedure", name: "Chronic Disease Treatment" },
              ],
              openingHoursSpecification: [
                { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "06:00", closes: "08:00" },
                { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "15:00", closes: "18:00" },
                { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "10:00", closes: "17:00" },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        {/* Skip-to-content link for accessibility (Req 13.5) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        <Providers locale={locale} messages={messages}>
          <OfflineIndicator />
          <GoogleAnalytics />
          <main id="main-content">{children}</main>
          <WhatsAppButton />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
