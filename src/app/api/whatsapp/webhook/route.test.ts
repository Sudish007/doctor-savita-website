/**
 * Unit tests for WhatsApp webhook route.
 * Validates: Requirements 24.1, 24.2, 24.3, 24.4, 24.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Sanity client before importing the route
vi.mock('@/lib/sanity/client', () => ({
  previewClient: {
    create: vi.fn(),
  },
}));

import { POST } from './route';
import { previewClient } from '@/lib/sanity/client';

const mockCreate = vi.mocked(previewClient.create);

function createRequest(body: object): Request {
  return new Request('http://localhost:3000/api/whatsapp/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/whatsapp/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ _id: 'test-article-123' } as any);
  });

  it('returns 400 when post has no text or media', async () => {
    const request = createRequest({});
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain('text content or media');
  });

  it('creates a draft article from text post', async () => {
    const request = createRequest({
      text: 'Boost your immunity naturally. Homeopathic remedies can help strengthen your immune system during cold and flu season.',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.articleId).toBe('test-article-123');
    expect(data.status).toBe('draft');
    expect(data.title).toBe('Boost your immunity naturally');
    expect(data.category).toBe('immunity');
  });

  it('auto-generates title from first sentence (max 100 chars)', async () => {
    const longText = 'This is a very long first sentence that goes on and on and keeps going and goes even further to exceed the one hundred character limit for titles. Second sentence here.';
    const request = createRequest({ text: longText });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title.length).toBeLessThanOrEqual(100);
  });

  it('auto-categorizes post by keyword detection', async () => {
    const request = createRequest({
      text: 'Managing anxiety and depression with homeopathic remedies for better sleep quality.',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.category).toBe('mental-wellness');
  });

  it('defaults to "immunity" category when no keywords match', async () => {
    const request = createRequest({
      text: 'A general health tip for everyone today.',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.category).toBe('immunity');
  });

  it('imports article as "draft" status requiring approval', async () => {
    const request = createRequest({
      text: 'Simple health tip for the day.',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('draft');
    expect(data.message).toContain('draft');
    expect(data.message).toContain('approval');

    // Verify Sanity document was created with draft status
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'article',
        status: 'draft',
      })
    );
  });

  it('formats body with paragraph breaks as Portable Text blocks', async () => {
    const request = createRequest({
      text: 'First paragraph about immunity.\n\nSecond paragraph about cold prevention.',
    });

    await POST(request);

    const createCall = mockCreate.mock.calls[0][0] as any;
    expect(createCall.body).toBeInstanceOf(Array);
    expect(createCall.body.length).toBe(2);
    expect(createCall.body[0]._type).toBe('block');
    expect(createCall.body[1]._type).toBe('block');
  });

  it('handles posts with images (uses first as featured image reference)', async () => {
    const request = createRequest({
      text: 'Skin care tips for summer.',
      mediaUrls: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    });

    await POST(request);

    const createCall = mockCreate.mock.calls[0][0] as any;
    expect(createCall.featuredImageUrl).toBe('https://example.com/image1.jpg');
  });

  it('uses default category image when no media attached', async () => {
    const request = createRequest({
      text: 'Tips for better digestion and stomach health.',
    });

    await POST(request);

    const createCall = mockCreate.mock.calls[0][0] as any;
    // No featuredImageUrl should be set (default image is used at render time)
    expect(createCall.featuredImageUrl).toBeUndefined();
  });

  it('returns 503 when Sanity connection fails', async () => {
    mockCreate.mockRejectedValue(new Error('Sanity connection failed'));

    const request = createRequest({
      text: 'A health tip post.',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.success).toBe(false);
    expect(data.message).toContain('Sanity');
    expect(data.title).toBeDefined();
    expect(data.category).toBeDefined();
  });

  it('sets correct author and language defaults', async () => {
    const request = createRequest({
      text: 'Health tips from Dr. Savita.',
    });

    await POST(request);

    const createCall = mockCreate.mock.calls[0][0] as any;
    expect(createCall.author).toBe('Dr. Savita Kumari');
    expect(createCall.language).toBe('en');
  });

  it('generates a valid slug from the title', async () => {
    const request = createRequest({
      text: "Boost Your Immunity! With Nature's Remedies.",
    });

    await POST(request);

    const createCall = mockCreate.mock.calls[0][0] as any;
    const slug = createCall.slug.current;
    // Slug should be lowercase, no special chars, hyphens for spaces
    expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slug).not.toContain(' ');
  });

  it('uses provided timestamp when available', async () => {
    const customTimestamp = '2025-01-15T10:30:00.000Z';
    const request = createRequest({
      text: 'A post with a specific timestamp.',
      timestamp: customTimestamp,
    });

    await POST(request);

    const createCall = mockCreate.mock.calls[0][0] as any;
    expect(createCall.publishDate).toBe(customTimestamp);
  });
});
