'use client'

import Script from 'next/script'

/**
 * Google Analytics 4 component.
 * Set NEXT_PUBLIC_GA_ID env var to enable tracking.
 * Example: NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
