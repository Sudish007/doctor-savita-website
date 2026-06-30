/**
 * UPI App Icons — Inline SVGs based on official brand colors.
 * No external requests, loads instantly with the page.
 */

export function GPayIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      {/* Google Pay "G" logo - 4 color Google icon */}
      <rect width="48" height="48" rx="12" fill="#fff" stroke="#e8e8e8" strokeWidth="1"/>
      <path d="M36.64 24.2c0-.82-.07-1.6-.2-2.36H24.5v4.46h6.82a5.83 5.83 0 01-2.53 3.82v3.18h4.1c2.4-2.2 3.78-5.46 3.78-9.1z" fill="#4285F4"/>
      <path d="M24.5 37c3.42 0 6.29-1.13 8.39-3.07l-4.1-3.18c-1.13.76-2.58 1.21-4.29 1.21-3.3 0-6.1-2.23-7.1-5.23h-4.23v3.28A12.5 12.5 0 0024.5 37z" fill="#34A853"/>
      <path d="M17.4 26.73a7.5 7.5 0 010-4.78v-3.28h-4.23a12.5 12.5 0 000 11.34l4.23-3.28z" fill="#FBBC05"/>
      <path d="M24.5 16.72c1.86 0 3.53.64 4.84 1.9l3.63-3.63C30.78 12.97 27.9 11.7 24.5 11.7a12.5 12.5 0 00-11.33 7.08l4.23 3.28c1-3 3.8-5.23 7.1-5.23z" fill="#EA4335"/>
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
      <rect width="48" height="48" rx="12" fill="#00B9F5"/>
      <text x="24" y="26" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">Paytm</text>
      <text x="24" y="34" textAnchor="middle" fontSize="6" fill="white" fontFamily="Arial, sans-serif">pay</text>
    </svg>
  )
}

export function BhimIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#fff" stroke="#ddd" strokeWidth="1"/>
      {/* BHIM UPI official colors */}
      <path d="M12 14h24v4H12z" fill="#FF9933"/>
      <path d="M12 18h24v4H12z" fill="#FFFFFF"/>
      <path d="M12 22h24v4H12z" fill="#138808"/>
      <circle cx="24" cy="20" r="2.5" fill="#000080"/>
      <text x="24" y="33" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#2E3192" fontFamily="Arial, sans-serif">BHIM</text>
      <text x="24" y="40" textAnchor="middle" fontSize="5" fill="#666" fontFamily="Arial, sans-serif">UPI</text>
    </svg>
  )
}

export function AmazonPayIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#232F3E"/>
      {/* Amazon logo with smile arrow */}
      <text x="24" y="22" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">amazon</text>
      {/* Orange smile/arrow */}
      <path d="M14 26c5 3.5 12 5 19 2.5" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M31 25.5l2.5 3-3.5.5" fill="#FF9900"/>
      <text x="24" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FF9900" fontFamily="Arial, sans-serif">pay</text>
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
