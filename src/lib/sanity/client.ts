import { createClient, type SanityClient } from '@sanity/client';

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

/**
 * Lazy Sanity client initialization.
 * Only creates the client when actually called, preventing build-time crashes
 * when NEXT_PUBLIC_SANITY_PROJECT_ID is not set.
 */

let _sanityClient: SanityClient | null = null;
let _previewClient: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!_sanityClient) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
      throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not configured');
    }
    _sanityClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    });
  }
  return _sanityClient;
}

export function getPreviewClient(): SanityClient {
  if (!_previewClient) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!projectId) {
      throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not configured');
    }
    _previewClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    });
  }
  return _previewClient;
}

// Keep backward-compatible exports (lazy getters)
export const sanityClient = new Proxy({} as SanityClient, {
  get(_target, prop) {
    const client = getSanityClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

export const previewClient = new Proxy({} as SanityClient, {
  get(_target, prop) {
    const client = getPreviewClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

/**
 * Returns the appropriate client based on preview mode.
 */
export function getClient(preview = false) {
  return preview ? getPreviewClient() : getSanityClient();
}
