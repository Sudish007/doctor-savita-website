/**
 * Local SVG icons for UPI apps — no external dependencies, guaranteed to load.
 */

export function GPayIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" fill="#FFC107"/>
      <path d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00"/>
      <path d="M24 44c5.4 0 10.2-2 13.9-5.4l-6.4-5.4c-2.1 1.6-4.7 2.5-7.5 2.5-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" fill="#4CAF50"/>
      <path d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4 5.6l6.4 5.4C37.1 39.6 44 34 44 24c0-1.3-.1-2.7-.4-3.9z" fill="#1976D2"/>
    </svg>
  )
}

export function PhonePeIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#5F259F"/>
      <path d="M15 14h8.5c4.5 0 7.5 2.8 7.5 7 0 4.2-3 7-7.5 7H20v7h-5V14zm5 4.5v5h3.2c1.7 0 2.8-1 2.8-2.5s-1.1-2.5-2.8-2.5H20z" fill="white"/>
      <path d="M33 28l-4 5h8l-4-5z" fill="white"/>
    </svg>
  )
}

export function PaytmIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#00BAF2"/>
      <path d="M8 20h4v2h-2v2h2v2H8v-6zm6 0h4v6h-2v-4h-1v4h-1v-6zm6 0h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1v-2h1v-2h-1v4h-2v-6zm8 0h5v2h-1.5v4h-2v-4H28v-2zm7 0h2l1.5 3 1.5-3h2v6h-2v-3l-1.5 3-1.5-3v3h-2v-6z" fill="white"/>
    </svg>
  )
}

export function BhimIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#00897B"/>
      <text x="24" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">UPI</text>
    </svg>
  )
}

export function AmazonPayIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#232F3E"/>
      <path d="M12 28c5.3 3.4 13 5.2 19.5 3.2 1-.3 2-.7 2.8-1.1.4-.2.8.2.4.6-3.5 3.5-11.5 4.8-17 2.5C13.8 31.5 11.5 29.5 12 28z" fill="#FF9900"/>
      <path d="M34.5 27c-.3-.4-2.2-.2-3-.1-.3 0-.3-.2-.1-.4 1.5-1 3.9-.7 4.2-.4.3.4-.1 3-1.4 4.3-.2.2-.4.1-.3-.2.3-.8 1-2.5.6-3.2z" fill="#FF9900"/>
      <text x="24" y="25" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">amazon</text>
    </svg>
  )
}

export function WhatsAppPayIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#25D366"/>
      <path d="M24 10c-7.7 0-14 6.3-14 14 0 2.5.7 4.8 1.8 6.8L10 38l7.4-1.9c2 1 4.2 1.5 6.6 1.5 7.7 0 14-6.3 14-14s-6.3-14-14-14zm0 25.5c-2.2 0-4.3-.6-6.1-1.6l-.4-.3-4.4 1.2 1.2-4.3-.3-.4c-1.2-1.9-1.8-4.1-1.8-6.5 0-6.3 5.2-11.5 11.5-11.5S35.5 17.3 35.5 23.6 30.3 35.5 24 35.5z" fill="white"/>
      <path d="M31 27.3c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-1 1.2-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.8-1.1-1-1.8-2.2-2-2.6-.2-.4 0-.6.2-.7.1-.1.3-.4.5-.6.2-.2.2-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.6 5.8 5.1.8.3 1.5.5 2 .7.8.3 1.6.2 2.2.1.7-.1 2.2-.9 2.5-1.7.3-.9.3-1.6.2-1.7-.1-.2-.4-.3-.8-.5z" fill="white"/>
    </svg>
  )
}
