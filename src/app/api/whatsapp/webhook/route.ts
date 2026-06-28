import { NextResponse } from 'next/server';

import { previewClient } from '@/lib/sanity/client';
import { categorizeByKeywords } from '@/lib/utils/categorize';
import { generateTitleFromPost } from '@/lib/utils/blog';
import type { HealthCategory } from '@/types';

/**
 * POST /api/whatsapp/webhook
 *
 * Webhook endpoint for receiving WhatsApp channel posts and auto-syncing
 * them as draft blog articles. This supports the MedyFacts channel → blog pipeline.
 *
 * Flow:
 * 1. Receive incoming WhatsApp channel post (text + optional media)
 * 2. Auto-generate title from first sentence (max 100 chars, word boundary)
 * 3. Auto-categorize by keyword detection from fixed category list
 * 4. Format body with paragraph breaks and bold key terms
 * 5. Create Sanity document as "draft" status (requires one-tap approval)
 * 6. Return 200 with created article ID
 *
 * Requirements: 24.1, 24.2, 24.3, 24.4, 24.5
 */

/** Default category images mapped to each health category */
const DEFAULT_CATEGORY_IMAGES: Record<HealthCategory, string> = {
  immunity: '/images/blog/immunity-default.jpg',
  'skin-care': '/images/blog/skin-care-default.jpg',
  digestion: '/images/blog/digestion-default.jpg',
  'womens-health': '/images/blog/womens-health-default.jpg',
  'child-care': '/images/blog/child-care-default.jpg',
  'mental-wellness': '/images/blog/mental-wellness-default.jpg',
};

interface WhatsAppWebhookPayload {
  /** The text content of the WhatsApp channel post */
  text?: string;
  /** Array of media URLs attached to the post (images, videos, etc.) */
  mediaUrls?: string[];
  /** Timestamp of the post (ISO string) */
  timestamp?: string;
  /** Sender info (channel name) */
  from?: string;
}

interface WebhookResponse {
  success: boolean;
  articleId?: string;
  title?: string;
  category?: HealthCategory;
  status?: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body: WhatsAppWebhookPayload = await request.json();

    // Validate that we have at least text content
    if (!body.text && (!body.mediaUrls || body.mediaUrls.length === 0)) {
      return NextResponse.json<WebhookResponse>(
        {
          success: false,
          message: 'Post must contain text content or media.',
        },
        { status: 400 }
      );
    }

    const postText = body.text || '';
    const mediaUrls = body.mediaUrls || [];
    const timestamp = body.timestamp || new Date().toISOString();

    // 1. Auto-generate title from first sentence (max 100 chars, word boundary)
    const title = generateTitleFromPost(postText);

    // 2. Auto-categorize by keyword detection
    const category = categorizeByKeywords(postText);

    // 3. Generate slug from title
    const slug = generateSlug(title);

    // 4. Format body with paragraph breaks and bold key terms
    const formattedBody = formatPostBody(postText);

    // 5. Determine featured image: use first attached image or default category image
    const featuredImageUrl = mediaUrls.length > 0
      ? mediaUrls[0]
      : DEFAULT_CATEGORY_IMAGES[category];

    // 6. Create Sanity document as draft
    const articleDoc = {
      _type: 'article',
      title,
      slug: { _type: 'slug', current: slug },
      body: formattedBody,
      category,
      tags: [],
      author: 'Dr. Savita Kumari',
      publishDate: timestamp,
      status: 'draft',
      language: 'en',
      ...(featuredImageUrl && mediaUrls.length > 0
        ? { featuredImageUrl } // Store URL reference for media from WhatsApp
        : {}),
    };

    let articleId: string;

    try {
      // Try creating in Sanity CMS
      const result = await previewClient.create(articleDoc);
      articleId = result._id;
    } catch (sanityError) {
      // If Sanity is not connected, log and return a fallback response
      console.error('[WhatsApp Webhook] Sanity create error:', sanityError);

      // Return partial success — post was received but could not be stored
      return NextResponse.json<WebhookResponse>(
        {
          success: false,
          message: 'Post received but failed to create article in CMS. Please check Sanity connection.',
          title,
          category,
        },
        { status: 503 }
      );
    }

    // 7. Return success with article details
    const response: WebhookResponse = {
      success: true,
      articleId,
      title,
      category,
      status: 'draft',
      message: `Article created as draft. Title: "${title}". Category: ${category}. Requires approval to publish.`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[WhatsApp Webhook] Unexpected error:', error);
    return NextResponse.json<WebhookResponse>(
      {
        success: false,
        message: 'An unexpected error occurred processing the WhatsApp post.',
      },
      { status: 500 }
    );
  }
}

/**
 * Generates a URL-friendly slug from a title string.
 * Converts to lowercase, replaces non-alphanumeric with hyphens,
 * removes leading/trailing hyphens, and collapses multiple hyphens.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 96); // Keep slug reasonable length
}

/**
 * Formats raw WhatsApp post text into Portable Text blocks.
 * - Splits by double newlines into paragraphs
 * - Bolds key medical/health terms within the text
 * - Returns Sanity Portable Text block array
 */
function formatPostBody(text: string): any[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Split into paragraphs by double newlines or single newlines
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // If single block without paragraph breaks, split by single newlines
  const blocks: string[] = paragraphs.length === 1 && text.includes('\n')
    ? text.split('\n').map((p) => p.trim()).filter((p) => p.length > 0)
    : paragraphs;

  // Key health terms to bold
  const boldTerms = [
    'homeopathy', 'homeopathic', 'remedy', 'treatment', 'health',
    'immunity', 'digestion', 'skin', 'wellness', 'ayush',
    'doctor', 'symptoms', 'cure', 'healing', 'medicine',
    'consultation', 'prevention', 'diet', 'exercise', 'sleep',
  ];

  return blocks.map((paragraph) => {
    const children = formatParagraphWithBoldTerms(paragraph, boldTerms);

    return {
      _type: 'block',
      _key: generateBlockKey(),
      style: 'normal',
      markDefs: [],
      children,
    };
  });
}

/**
 * Formats a paragraph string into Portable Text children,
 * bolding key health terms found in the text.
 */
function formatParagraphWithBoldTerms(
  text: string,
  boldTerms: string[]
): any[] {
  // Simple approach: find terms and create spans
  // Build a regex that matches any of the bold terms (case-insensitive, word boundary)
  const termPattern = boldTerms
    .map((term) => `\\b${term}\\b`)
    .join('|');
  const regex = new RegExp(`(${termPattern})`, 'gi');

  const parts = text.split(regex);

  if (parts.length === 1) {
    // No matches, return plain text
    return [
      {
        _type: 'span',
        _key: generateBlockKey(),
        text,
        marks: [],
      },
    ];
  }

  return parts
    .filter((part) => part.length > 0)
    .map((part) => {
      const isBold = regex.test(part);
      // Reset regex lastIndex after test
      regex.lastIndex = 0;

      return {
        _type: 'span',
        _key: generateBlockKey(),
        text: part,
        marks: isBold ? ['strong'] : [],
      };
    });
}

/**
 * Generates a simple unique key for Portable Text blocks/spans.
 */
function generateBlockKey(): string {
  return Math.random().toString(36).substring(2, 10);
}
