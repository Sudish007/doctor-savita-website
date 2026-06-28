import type { Metadata } from 'next';
import { FirstAidClient } from './FirstAidClient';

/**
 * First-Aid Guide page with Static Site Generation.
 * Designed for offline access via Service Worker (configured in task 13.2).
 *
 * Requirements: 36.1, 36.2, 36.3, 36.5, 36.6, 36.7
 */

// SSG — static page, ideal for Service Worker caching
export const revalidate = false;

export const metadata: Metadata = {
  title: 'First-Aid Guide | Dr. Savita Kumari',
  description:
    'Quick homeopathic first-aid guide for 20+ common emergencies. Fever, burns, cuts, sprains, and more with recommended remedies and dosage.',
  openGraph: {
    title: 'First-Aid Guide | Dr. Savita Kumari',
    description:
      'Quick homeopathic first-aid guide for 20+ common emergencies with recommended remedies.',
  },
};

/**
 * NOTE: Service Worker registration placeholder.
 * The actual Service Worker setup will be implemented in task 13.2.
 * This page is designed to be fully cacheable for offline access.
 * SW registration will go in src/app/layout.tsx or a dedicated SW registration component.
 *
 * Offline caching config:
 * - Cache strategy: CacheFirst for this page and its static assets
 * - Pre-cache the first-aid data as part of the SW install step
 * - Serve stale content when offline with "Offline Mode" badge
 */

export default function FirstAidPage() {
  return (
    <main className="section-padding min-h-screen">
      <div className="container-content">
        <FirstAidClient />
      </div>
    </main>
  );
}
