import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

/**
 * Sanity client configured with CDN for public-facing queries.
 * Uses the CDN for fast cached reads.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Sanity client configured for preview/draft mode.
 * Bypasses CDN and uses the API token for authenticated access.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Returns the appropriate client based on preview mode.
 */
export function getClient(preview = false) {
  return preview ? previewClient : sanityClient;
}
