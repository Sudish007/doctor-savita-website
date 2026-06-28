import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { BlogArticle } from '@/types';
import { getRelatedArticles } from '@/lib/utils/blog';
import { calculateReadingTime } from '@/lib/utils/reading-time';
import { RelatedArticles } from '@/components/blog/RelatedArticles';

/**
 * Article detail page with SSG + ISR.
 * Renders full article body, reading time, author, and related articles.
 *
 * Requirements: 8.3, 8.9, 13.1, 13.3
 */

// ISR: Revalidate every 300 seconds (5 minutes)
export const revalidate = 300;

// ─── Mock Articles (fallback when Sanity is not connected) ───────────────────

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
      {
        _type: 'block',
        children: [
          {
            text: 'Homeopathy works by stimulating the body\'s own defense mechanisms. Unlike conventional medicine that suppresses symptoms, homeopathic remedies encourage the body to heal itself from within.',
          },
        ],
      },
      {
        _type: 'block',
        children: [
          {
            text: 'Key immunity-boosting remedies include Echinacea for general immune support, Arsenicum Album for digestive immunity, and Thuja for respiratory defense. These can be used preventively during seasonal changes.',
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
      {
        _type: 'block',
        children: [
          {
            text: 'Understanding the underlying constitutional type of the patient is key to selecting the right remedy. A homeopath considers the full picture including mental, emotional, and physical symptoms.',
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
      {
        _type: 'block',
        children: [
          {
            text: 'Nux Vomica is particularly effective for those with sedentary lifestyles who overindulge in rich food and stimulants. Lycopodium addresses bloating and gas, while Carbo Veg helps with indigestion and flatulence.',
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

// ─── Category Display Config ─────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  immunity: 'Immunity',
  'skin-care': 'Skin Care',
  digestion: 'Digestion',
  'womens-health': "Women's Health",
  'child-care': 'Child Care',
  'mental-wellness': 'Mental Wellness',
};

const CATEGORY_CLASS: Record<string, string> = {
  immunity: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'skin-care': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  digestion: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'womens-health': 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  'child-care': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  'mental-wellness': 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extracts plain text from Portable Text body blocks.
 */
function extractBodyText(body: any[]): string {
  if (!Array.isArray(body)) return '';
  return body
    .filter((block: any) => block._type === 'block')
    .map((block: any) =>
      (block.children || []).map((child: any) => child.text || '').join('')
    )
    .join(' ');
}

/**
 * Renders Portable Text body blocks as HTML paragraphs.
 * Simplified rendering: maps each block to a <p> tag with its text content.
 */
function renderPortableText(body: any[]): React.ReactNode[] {
  if (!Array.isArray(body)) return [];

  return body
    .filter((block: any) => block._type === 'block')
    .map((block: any, index: number) => {
      const text = (block.children || [])
        .map((child: any) => child.text || '')
        .join('');

      if (!text.trim()) return null;

      return (
        <p
          key={index}
          className="text-[var(--foreground)] leading-relaxed text-base md:text-lg mb-5"
        >
          {text}
        </p>
      );
    })
    .filter(Boolean);
}

// ─── Data Fetching ───────────────────────────────────────────────────────────

/**
 * Fetches all articles from Sanity CMS with fallback to mock data.
 */
async function getAllArticles(): Promise<BlogArticle[]> {
  try {
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

/**
 * Fetches a single article by slug from Sanity CMS or mock data.
 */
async function getArticleBySlug(slug: string): Promise<BlogArticle | null> {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (projectId) {
      const { sanityClient } = await import('@/lib/sanity/client');
      const { articleBySlugQuery } = await import('@/lib/sanity/queries');
      const article = await sanityClient.fetch(articleBySlugQuery, { slug });
      if (article) return article;
    }
  } catch {
    // Sanity not connected — fall through to mock data
  }

  return MOCK_ARTICLES.find((a) => a.slug.current === slug) || null;
}

// ─── Dynamic Metadata with Open Graph Tags ───────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Dr. Savita Kumari',
      description: 'The requested article could not be found.',
    };
  }

  // og:title ≤ 60 chars, og:description ≤ 155 chars (Requirements 13.1)
  const ogTitle = article.title.length > 60
    ? article.title.slice(0, 57) + '...'
    : article.title;

  const ogDescription = article.excerpt.length > 155
    ? article.excerpt.slice(0, 152) + '...'
    : article.excerpt;

  return {
    title: `${ogTitle} | Dr. Savita Kumari`,
    description: ogDescription,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      url: `/blog/${slug}`,
      images: article.featuredImage
        ? [{ url: article.featuredImage, alt: article.title }]
        : undefined,
    },
  };
}

// ─── Static Params Generation ────────────────────────────────────────────────

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug.current,
  }));
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getAllArticles();
  const relatedArticles = getRelatedArticles(article, allArticles, 3);

  // Calculate reading time from body text
  const bodyText = extractBodyText(article.body);
  const readingTime = article.readingTime || calculateReadingTime(bodyText);

  const formattedDate = new Date(article.publishDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;
  const categoryClass = CATEGORY_CLASS[article.category] || '';

  return (
    <main className="section-padding min-h-screen">
      <div className="container-content max-w-3xl mx-auto">
        {/* Article Header */}
        <header className="mb-8 space-y-4">
          {/* Category Badge */}
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${categoryClass}`}
          >
            {categoryLabel}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--card-foreground)] leading-tight">
            {article.title}
          </h1>

          {/* Meta Info: Author, Date, Reading Time */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)]">
            {/* Author */}
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span>{article.author}</span>
            </div>

            {/* Publish Date */}
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <time dateTime={article.publishDate}>{formattedDate}</time>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* Article Body (Portable Text rendered as paragraphs) */}
        <article className="prose-custom mb-12">
          {renderPortableText(article.body)}
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pt-6 border-t border-[var(--card-border)]">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--muted)] text-[var(--foreground-muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />
      </div>
    </main>
  );
}
