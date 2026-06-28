import type { Metadata } from 'next';
import type { BlogArticle } from '@/types';
import { BlogListingClient } from '@/components/blog/BlogListingClient';
import { WhatsAppChannelWidget } from '@/components/shared/WhatsAppChannelWidget';

/**
 * Blog listing page with Static Site Generation and Incremental Static Regeneration.
 * Revalidates every 300 seconds (5 minutes).
 *
 * Requirements: 8.1, 8.2, 8.4, 8.5, 8.6, 8.7, 8.8
 */

// ISR: Revalidate every 300 seconds
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Health Blog | Dr. Savita Kumari',
  description:
    'Expert articles on homeopathic remedies, immunity, skin care, digestion, and holistic health by Dr. Savita Kumari.',
  openGraph: {
    title: 'Health Blog | Dr. Savita Kumari',
    description:
      'Expert articles on homeopathic remedies, immunity, skin care, digestion, and holistic health.',
  },
};

/**
 * Mock articles used as fallback when Sanity is not connected.
 * These provide sample data to render the UI properly.
 */
const MOCK_ARTICLES: BlogArticle[] = [
  {
    _id: 'mock-1',
    title: 'Boosting Immunity Naturally with Homeopathy',
    slug: { current: 'boosting-immunity-naturally' },
    body: [
      {
        _type: 'block',
        children: [
          {
            text: 'Discover how homeopathic remedies like Echinacea, Arsenicum Album, and Thuja can strengthen your immune system naturally without side effects. Learn daily habits that complement homeopathic treatment for optimal health.',
          },
        ],
      },
    ],
    excerpt:
      'Discover how homeopathic remedies like Echinacea, Arsenicum Album, and Thuja can strengthen your immune system naturally without side effects.',
    featuredImage: undefined,
    category: 'immunity',
    tags: ['immunity', 'homeopathy', 'natural-healing'],
    author: 'Dr. Savita Kumari',
    publishDate: '2024-12-15',
    status: 'published',
    readingTime: 5,
    language: 'en',
  },
  {
    _id: 'mock-2',
    title: 'Understanding Eczema: A Homeopathic Approach',
    slug: { current: 'understanding-eczema-homeopathic-approach' },
    body: [
      {
        _type: 'block',
        children: [
          {
            text: 'Eczema affects millions worldwide. Homeopathic treatment offers a gentle, long-term solution by addressing the root cause rather than suppressing symptoms. Graphites, Sulphur, and Petroleum are commonly used remedies.',
          },
        ],
      },
    ],
    excerpt:
      'Eczema affects millions worldwide. Homeopathic treatment offers a gentle, long-term solution by addressing the root cause rather than suppressing symptoms.',
    featuredImage: undefined,
    category: 'skin-care',
    tags: ['skin-care', 'eczema', 'chronic-conditions'],
    author: 'Dr. Savita Kumari',
    publishDate: '2024-12-10',
    status: 'published',
    readingTime: 7,
    language: 'en',
  },
  {
    _id: 'mock-3',
    title: 'Natural Remedies for Digestive Health',
    slug: { current: 'natural-remedies-digestive-health' },
    body: [
      {
        _type: 'block',
        children: [
          {
            text: 'Good digestion is the foundation of good health. Learn about Nux Vomica, Lycopodium, and Carbo Veg — powerful homeopathic remedies for common digestive issues like acidity, bloating, and constipation.',
          },
        ],
      },
    ],
    excerpt:
      'Good digestion is the foundation of good health. Learn about Nux Vomica, Lycopodium, and Carbo Veg for common digestive issues.',
    featuredImage: undefined,
    category: 'digestion',
    tags: ['digestion', 'acidity', 'remedies'],
    author: 'Dr. Savita Kumari',
    publishDate: '2024-12-05',
    status: 'published',
    readingTime: 6,
    language: 'en',
  },
  {
    _id: 'mock-4',
    title: "Women's Health: Managing PCOS with Homeopathy",
    slug: { current: 'managing-pcos-homeopathy' },
    body: [
      {
        _type: 'block',
        children: [
          {
            text: 'PCOS is a growing concern among women. Homeopathic remedies like Pulsatilla, Sepia, and Calcarea Carb can help regulate hormonal imbalances and restore menstrual regularity without harsh synthetic hormones.',
          },
        ],
      },
    ],
    excerpt:
      'PCOS is a growing concern among women. Homeopathic remedies can help regulate hormonal imbalances and restore menstrual regularity naturally.',
    featuredImage: undefined,
    category: 'womens-health',
    tags: ['womens-health', 'pcos', 'hormones'],
    author: 'Dr. Savita Kumari',
    publishDate: '2024-11-28',
    status: 'published',
    readingTime: 8,
    language: 'en',
  },
  {
    _id: 'mock-5',
    title: 'Homeopathic Care for Children: Safe & Gentle',
    slug: { current: 'homeopathic-care-children' },
    body: [
      {
        _type: 'block',
        children: [
          {
            text: "Children respond exceptionally well to homeopathic medicine. From teething troubles to recurrent colds, discover safe remedies like Chamomilla, Calcarea Carb, and Silicea that support your child's natural development.",
          },
        ],
      },
    ],
    excerpt:
      'Children respond exceptionally well to homeopathic medicine. Discover safe remedies for teething, colds, and developmental support.',
    featuredImage: undefined,
    category: 'child-care',
    tags: ['child-care', 'pediatric', 'gentle-remedies'],
    author: 'Dr. Savita Kumari',
    publishDate: '2024-11-20',
    status: 'published',
    readingTime: 5,
    language: 'en',
  },
  {
    _id: 'mock-6',
    title: 'Managing Anxiety and Stress Through Homeopathy',
    slug: { current: 'managing-anxiety-stress-homeopathy' },
    body: [
      {
        _type: 'block',
        children: [
          {
            text: "Mental wellness is crucial in today's fast-paced world. Homeopathic remedies like Ignatia, Kali Phos, and Argentum Nitricum provide gentle relief from anxiety, stress, and sleep disturbances without dependency.",
          },
        ],
      },
    ],
    excerpt:
      "Mental wellness is crucial in today's fast-paced world. Homeopathic remedies provide gentle relief from anxiety and stress without dependency.",
    featuredImage: undefined,
    category: 'mental-wellness',
    tags: ['mental-wellness', 'anxiety', 'stress'],
    author: 'Dr. Savita Kumari',
    publishDate: '2024-11-15',
    status: 'published',
    readingTime: 6,
    language: 'en',
  },
  {
    _id: 'mock-7',
    title: 'Winter Immunity: Preparing Your Body for Cold Season',
    slug: { current: 'winter-immunity-cold-season' },
    body: [
      {
        _type: 'block',
        children: [
          {
            text: 'As winter approaches, it is important to strengthen your immune defenses. Learn about Oscillococcinum, Influenzinum, and lifestyle changes that can help prevent colds and flu naturally.',
          },
        ],
      },
    ],
    excerpt:
      'As winter approaches, strengthen your immune defenses. Learn about remedies and lifestyle changes to prevent colds and flu naturally.',
    featuredImage: undefined,
    category: 'immunity',
    tags: ['immunity', 'winter', 'prevention'],
    author: 'Dr. Savita Kumari',
    publishDate: '2024-11-10',
    status: 'published',
    readingTime: 4,
    language: 'en',
  },
  {
    _id: 'mock-8',
    title: 'Acne and Skin Health: Homeopathic Solutions',
    slug: { current: 'acne-skin-health-homeopathic-solutions' },
    body: [
      {
        _type: 'block',
        children: [
          {
            text: 'Acne is not just a cosmetic concern — it reflects internal imbalances. Homeopathic remedies like Berberis Aquifolium, Kali Bromatum, and Hepar Sulph treat acne from within, addressing hormonal and digestive root causes.',
          },
        ],
      },
    ],
    excerpt:
      'Acne reflects internal imbalances. Homeopathic remedies treat acne from within, addressing hormonal and digestive root causes effectively.',
    featuredImage: undefined,
    category: 'skin-care',
    tags: ['skin-care', 'acne', 'hormones'],
    author: 'Dr. Savita Kumari',
    publishDate: '2024-11-05',
    status: 'published',
    readingTime: 6,
    language: 'en',
  },
];

/**
 * Fetches articles from Sanity CMS with fallback to mock data.
 */
async function getArticles(): Promise<BlogArticle[]> {
  try {
    // Attempt to use Sanity client if configured
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (projectId) {
      const { sanityClient } = await import('@/lib/sanity/client');
      const { articlesListQuery } = await import('@/lib/sanity/queries');
      const articles = await sanityClient.fetch(articlesListQuery, {
        start: 0,
        end: 100,
      });
      if (articles && articles.length > 0) {
        return articles;
      }
    }
  } catch {
    // Sanity not connected — fall through to mock data
  }

  return MOCK_ARTICLES;
}

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <main className="section-padding min-h-screen">
      <div className="container-content">
        {/* Page Header */}
        <header className="mb-10 space-y-2">
          <h1 className="text-gradient">Health Blog</h1>
          <p className="text-[var(--foreground-muted)] max-w-2xl">
            Expert insights on homeopathic remedies, natural wellness, and holistic health
            by Dr. Savita Kumari.
          </p>
        </header>

        {/* Blog Listing with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <BlogListingClient articles={articles} />
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
            <WhatsAppChannelWidget variant="compact" />
          </aside>
        </div>
      </div>
    </main>
  );
}
