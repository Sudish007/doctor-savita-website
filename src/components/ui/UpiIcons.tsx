/**
 * UPI App Icons — Using reliable external image CDN for accurate brand logos.
 * These are official logo SVGs served via img.logo.dev (free logo API).
 * Loads fast, cached by CDN and browser.
 */

interface IconProps {
  className?: string
}

export function GPayIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <img
      src="https://img.icons8.com/color/96/google-pay-india.png"
      alt="Google Pay"
      className={className + ' object-contain'}
      loading="eager"
    />
  )
}

export function PhonePeIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <img
      src="https://img.icons8.com/color/96/phone-pe.png"
      alt="PhonePe"
      className={className + ' object-contain'}
      loading="eager"
    />
  )
}

export function PaytmIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <img
      src="https://img.icons8.com/color/96/paytm.png"
      alt="Paytm"
      className={className + ' object-contain'}
      loading="eager"
    />
  )
}

export function BhimIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <img
      src="https://img.icons8.com/color/96/bhim.png"
      alt="BHIM UPI"
      className={className + ' object-contain'}
      loading="eager"
    />
  )
}

export function AmazonPayIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <img
      src="https://img.icons8.com/color/96/amazon-pay.png"
      alt="Amazon Pay"
      className={className + ' object-contain'}
      loading="eager"
    />
  )
}

export function WhatsAppPayIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <img
      src="https://img.icons8.com/color/96/whatsapp--v1.png"
      alt="WhatsApp Pay"
      className={className + ' object-contain'}
      loading="eager"
    />
  )
}
