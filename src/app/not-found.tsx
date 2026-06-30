import Link from 'next/link'

/**
 * Custom 404 Not Found page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
        <p className="text-foreground-muted mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/book"
            className="px-6 py-3 rounded-xl font-medium text-sm border border-border text-foreground hover:bg-muted transition-colors"
          >
            📅 Book Appointment
          </Link>
        </div>
        <p className="mt-8 text-xs text-foreground-muted">
          Dr. Savita Kumari (BHMS) | Saubhagya Multispeciality Clinic, Siwan
        </p>
      </div>
    </div>
  )
}
