/**
 * UPI App Icons — Inline SVGs based on official brand colors.
 * No external requests, loads instantly with the page.
 */

export function GPayIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.987 24.5l5.07-8.784h5.09L28.06 24.5l6.087 8.784h-5.18L23.987 24.5z" fill="#EA4335"/>
      <path d="M17.2 33.284V15.716h5.736c1.577 0 2.94.315 4.088.946a6.41 6.41 0 012.68 2.646c.63 1.134.946 2.437.946 3.908 0 1.482-.315 2.79-.946 3.924a6.453 6.453 0 01-2.68 2.652c-1.149.63-2.511.946-4.088.946H17.2z" fill="none" stroke="#4285F4" strokeWidth="2.5"/>
      <circle cx="12" cy="24.5" r="4" fill="#34A853"/>
      <circle cx="12" cy="24.5" r="2" fill="#FBBC05"/>
    </svg>
  )
}

export function PhonePeIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#5F259F"/>
      <path d="M16 12h7.5c5 0 8 3 8 7.5S28.5 27 23.5 27H21v8h-5V12zm5 4.5v6h2.5c2 0 3.2-1.2 3.2-3s-1.2-3-3.2-3H21z" fill="white"/>
    </svg>
  )
}

export function PaytmIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#00315D"/>
      <path d="M7 20h3.5c1.5 0 2.5 1 2.5 2.3 0 1.3-1 2.3-2.5 2.3H9v3.4H7V20zm2 1.4v2.3h1.3c.7 0 1.1-.4 1.1-1.1 0-.7-.4-1.2-1.1-1.2H9z" fill="white"/>
      <path d="M14.5 22.2c1.4 0 2.3 1 2.3 2.7v3.1h-1.7v-.6c-.4.5-1 .8-1.6.8-1.1 0-1.8-.7-1.8-1.6 0-1 .7-1.5 1.9-1.5h1.3v-.2c0-.6-.4-1-1.1-1-.5 0-1 .2-1.4.6l-.8-1c.6-.7 1.6-1.1 2.5-1.1h.4zm-.4 4.8c.5 0 .9-.2 1.2-.6v-.7h-1c-.6 0-.9.2-.9.6 0 .4.3.7.7.7z" fill="white"/>
      <path d="M18 24.2l-1-.1v-1.7l1-.1V20h1.8v2.2h1.4v1.7h-1.4v2.3c0 .4.2.6.6.6h.7v1.6c-.4.1-.8.2-1.2.2-1.3 0-1.9-.6-1.9-1.8v-2.6z" fill="white"/>
      <path d="M22 22.3h1.7v.7c.4-.5 1-.8 1.7-.8 1 0 1.7.5 2 1.3.5-.8 1.2-1.3 2.1-1.3 1.4 0 2.2.9 2.2 2.5V28h-1.8v-3c0-.8-.3-1.2-1-1.2-.6 0-1 .4-1.1 1.1V28H26v-3c0-.8-.3-1.2-1-1.2-.6 0-1 .4-1.1 1.1V28H22v-5.7z" fill="white"/>
      <rect x="33" y="19" width="8" height="10" rx="2" fill="#00B9F5"/>
      <path d="M35.5 22.5h3M35.5 24.5h3M35.5 26.5h2" stroke="white" strokeWidth=".8" strokeLinecap="round"/>
    </svg>
  )
}

export function BhimIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#fff" stroke="#ddd" strokeWidth="1"/>
      <path d="M10 16h6v3h-6z" fill="#098043"/>
      <path d="M10 19h6v3h-6z" fill="#fff"/>
      <path d="M10 22h6v3h-6z" fill="#F47920"/>
      <circle cx="13" cy="20.5" r="1" fill="#000088"/>
      <text x="20" y="28" fontSize="8" fontWeight="bold" fill="#333" fontFamily="Arial">BHIM</text>
    </svg>
  )
}

export function AmazonPayIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#232F3E"/>
      <path d="M13.8 30.8c4.6 3 10.8 4.6 16.3 4.6 3.2 0 6.7-.7 9.9-2 .5-.2.9.3.4.7-2.8 2.3-7.5 3.7-11.3 3.7-5.5 0-10.8-2-14.7-5.4-.3-.3 0-.7.3-.5l-.9-1.1z" fill="#FF9900"/>
      <path d="M36.4 29c-.4-.5-2.6-.2-3.6-.1-.3 0-.4-.2-.1-.4 1.8-1.2 4.6-.9 5-.5.3.4-.1 3.4-1.8 4.8-.3.2-.5.1-.4-.2.4-1 1.2-3.2.9-3.6z" fill="#FF9900"/>
      <text x="14" y="26" fontSize="7.5" fontWeight="bold" fill="white" fontFamily="Arial">amazon</text>
      <text x="14" y="32" fontSize="5" fill="#FF9900" fontFamily="Arial">pay</text>
    </svg>
  )
}

export function WhatsAppPayIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#25D366"/>
      <path d="M24 9C15.7 9 9 15.7 9 24c0 2.6.7 5.1 1.9 7.3L9 39l7.9-1.9c2.1 1.1 4.5 1.8 7.1 1.8 8.3 0 15-6.7 15-15S32.3 9 24 9zm0 27.5c-2.3 0-4.5-.6-6.4-1.7l-.5-.3-4.6 1.2 1.2-4.5-.3-.5c-1.2-2-1.9-4.3-1.9-6.7 0-6.9 5.6-12.5 12.5-12.5S36.5 17.1 36.5 24 30.9 36.5 24 36.5z" fill="white"/>
      <path d="M31.4 27.7c-.4-.2-2.4-1.2-2.8-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.5-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.3-2-1.2-1.1-2-2.4-2.3-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1 0 1.9 1.4 3.7 1.6 3.9.2.3 2.7 4.1 6.5 5.7.9.4 1.6.6 2.2.8.9.3 1.7.3 2.4.2.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5z" fill="white"/>
    </svg>
  )
}
