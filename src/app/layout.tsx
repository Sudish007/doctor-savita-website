import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
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
    default: "Dr. Savita Kumari | Homeopathic Medical Officer",
    template: "%s | Dr. Savita Kumari",
  },
  description:
    "Dr. Savita Kumari - Homeopathic Medical Officer, AYUSH Dept., Govt. of Bihar. Specializing in holistic homeopathic treatments in Siwan, Bihar.",
  openGraph: {
    title: "Dr. Savita Kumari | Homeopathic Medical Officer",
    description: "Homeopathic Doctor & Medical Officer, AYUSH Dept., Govt. of Bihar. Book appointment for holistic treatment in Siwan, Bihar.",
    url: "https://drsavitak.netlify.app",
    siteName: "Dr. Savita Kumari",
    images: [
      {
        url: "https://drsavitak.netlify.app/images/dr-savita-profile.jpg",
        width: 600,
        height: 600,
        alt: "Dr. Savita Kumari - Homeopathic Medical Officer",
      },
    ],
    type: "website",
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
          <main id="main-content">{children}</main>
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
