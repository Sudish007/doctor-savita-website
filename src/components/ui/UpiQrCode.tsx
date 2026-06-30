'use client'

/**
 * UPI QR Code component — uses the actual QR code image from Dr. Savita's UPI account.
 * Static image stored locally — instant load, no external API calls.
 */

interface UpiQrCodeProps {
  upiId: string
  payeeName: string
  amount: number
  size?: number
  note?: string
}

export function UpiQrCode({ payeeName, amount, size = 220 }: UpiQrCodeProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
        <img
          src="/images/upi-qr.jpeg"
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
