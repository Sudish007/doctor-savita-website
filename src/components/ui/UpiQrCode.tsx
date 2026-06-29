'use client'

/**
 * UPI QR Code component — generates QR code client-side using Canvas API.
 * No external library needed. Uses a minimal QR code generation algorithm.
 * 
 * For simplicity and reliability, we encode the UPI URI into a QR using
 * a Google Charts API URL (lightweight, no JS dependency, works everywhere).
 */

interface UpiQrCodeProps {
  upiId: string
  payeeName: string
  amount: number
  size?: number
  note?: string
}

export function UpiQrCode({ upiId, payeeName, amount, size = 220, note = 'Consultation Fee' }: UpiQrCodeProps) {
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
  
  // Use Google Charts QR API — lightweight, no bundle size, works on all devices
  const qrUrl = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(upiUri)}&choe=UTF-8&chld=M|2`

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
        <img
          src={qrUrl}
          alt={`UPI QR Code - Pay ₹${amount} to ${payeeName}`}
          width={size}
          height={size}
          className="rounded-lg"
          loading="eager"
        />
      </div>
      <div className="text-center">
        <p className="text-xs text-foreground-muted">Scan with any UPI app to pay</p>
        <p className="text-lg font-bold text-primary mt-0.5">₹{amount}</p>
      </div>
    </div>
  )
}
