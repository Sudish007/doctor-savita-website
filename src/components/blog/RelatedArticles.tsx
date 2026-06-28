import type { BlogArticle } from '@/types';
import { ArticleCard } from './ArticleCard';

interface RelatedArticlesProps {
  articles: BlogArticle[];
}

/**
 * RelatedArticles component renders a grid of up to 3 related articles
 * at the bottom of an article detail page.
 *
 * Requirements: 8.9
 */
export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-10 border-t border-[var(--card-border)]">
      <h2 className="text-2xl font-bold text-[var(--card-foreground)] mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </section>
  );
}
