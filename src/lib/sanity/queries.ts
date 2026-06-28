/**
 * GROQ queries for fetching content from Sanity CMS.
 */

// ─── Articles / Blog ─────────────────────────────────────────────────────────

/** Fetch all published articles ordered by publish date (descending), with pagination */
export const articlesListQuery = `
  *[_type == "article" && status == "published"] | order(publishDate desc) [$start...$end] {
    _id,
    title,
    slug,
    "excerpt": pt::text(body)[0...150],
    featuredImage,
    category,
    tags,
    publishDate,
    language
  }
`;

/** Fetch total count of published articles */
export const articlesCountQuery = `
  count(*[_type == "article" && status == "published"])
`;

/** Fetch a single article by slug */
export const articleBySlugQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    featuredImage,
    category,
    tags,
    publishDate,
    status,
    language,
    hindiTitle,
    hindiBody
  }
`;

/** Search articles by keyword in title or body */
export const articleSearchQuery = `
  *[_type == "article" && status == "published" && (
    title match $keyword || pt::text(body) match $keyword
  )] | order(publishDate desc) [0...20] {
    _id,
    title,
    slug,
    "excerpt": pt::text(body)[0...150],
    featuredImage,
    category,
    tags,
    publishDate,
    "titleMatch": title match $keyword
  }
`;

/** Fetch related articles by category or tags (exclude current article) */
export const relatedArticlesQuery = `
  *[_type == "article" && status == "published" && _id != $currentId && (
    category == $category || count((tags[])[@ in $tags]) > 0
  )] | order(publishDate desc) [0...3] {
    _id,
    title,
    slug,
    "excerpt": pt::text(body)[0...150],
    featuredImage,
    category,
    publishDate
  }
`;

/** Fetch recent articles as fallback for related (exclude current) */
export const recentArticlesQuery = `
  *[_type == "article" && status == "published" && _id != $currentId] | order(publishDate desc) [0...3] {
    _id,
    title,
    slug,
    "excerpt": pt::text(body)[0...150],
    featuredImage,
    category,
    publishDate
  }
`;

/** Fetch articles by category */
export const articlesByCategoryQuery = `
  *[_type == "article" && status == "published" && category == $category] | order(publishDate desc) {
    _id,
    title,
    slug,
    "excerpt": pt::text(body)[0...150],
    featuredImage,
    category,
    tags,
    publishDate
  }
`;

// ─── Remedies ────────────────────────────────────────────────────────────────

/** Fetch all remedies ordered by displayOrder */
export const remediesQuery = `
  *[_type == "remedy"] | order(displayOrder asc) {
    _id,
    name,
    source,
    primaryIndication,
    funFact,
    dosageNote,
    applications,
    icon,
    displayOrder
  }
`;

/** Fetch a single remedy by name */
export const remedyByNameQuery = `
  *[_type == "remedy" && name == $name][0] {
    _id,
    name,
    source,
    primaryIndication,
    funFact,
    dosageNote,
    applications,
    icon,
    displayOrder
  }
`;

/** Fetch total count of remedies (for rotation logic) */
export const remediesCountQuery = `
  count(*[_type == "remedy"])
`;

// ─── Case Studies ────────────────────────────────────────────────────────────

/** Fetch all case studies with consent confirmed */
export const caseStudiesQuery = `
  *[_type == "caseStudy" && consentConfirmed == true] {
    _id,
    condition,
    category,
    duration,
    outcomeSummary,
    narrative,
    beforeImage,
    afterImage,
    improvementPercentage,
    consentConfirmed
  }
`;

/** Fetch case studies by category */
export const caseStudiesByCategoryQuery = `
  *[_type == "caseStudy" && consentConfirmed == true && category == $category] {
    _id,
    condition,
    category,
    duration,
    outcomeSummary,
    narrative,
    beforeImage,
    afterImage,
    improvementPercentage
  }
`;

// ─── First Aid ───────────────────────────────────────────────────────────────

/** Fetch all first aid entries */
export const firstAidEntriesQuery = `
  *[_type == "firstAidEntry"] {
    _id,
    scenario,
    actionSteps,
    remedy,
    potency,
    dosage,
    emergencyWarning,
    translations
  }
`;

/** Search first aid entries by scenario keyword */
export const firstAidSearchQuery = `
  *[_type == "firstAidEntry" && scenario match $keyword] {
    _id,
    scenario,
    actionSteps,
    remedy,
    potency,
    dosage,
    emergencyWarning,
    translations
  }
`;

// ─── Seasonal Alerts ─────────────────────────────────────────────────────────

/** Fetch active seasonal alerts for the current month */
export const activeSeasonalAlertsQuery = `
  *[_type == "seasonalAlert" && $month in activeMonths] {
    _id,
    title,
    body,
    activeMonths,
    icon,
    relatedArticle->{
      _id,
      title,
      slug
    }
  }
`;

/** Fetch all seasonal alerts */
export const allSeasonalAlertsQuery = `
  *[_type == "seasonalAlert"] {
    _id,
    title,
    body,
    activeMonths,
    icon,
    relatedArticle->{
      _id,
      title,
      slug
    }
  }
`;

// ─── Health Calendar ─────────────────────────────────────────────────────────

/** Fetch all enabled health calendar dates */
export const healthCalendarQuery = `
  *[_type == "healthCalendarDate" && isEnabled == true] | order(date asc) {
    _id,
    name,
    date,
    templateArticle->{
      _id,
      title,
      slug,
      status
    },
    customArticle->{
      _id,
      title,
      slug,
      status
    },
    isEnabled
  }
`;

/** Fetch health calendar entry for today's date */
export const todayHealthCalendarQuery = `
  *[_type == "healthCalendarDate" && isEnabled == true && date == $today][0] {
    _id,
    name,
    date,
    templateArticle->{
      _id,
      title,
      slug,
      body,
      featuredImage
    },
    customArticle->{
      _id,
      title,
      slug,
      body,
      featuredImage
    }
  }
`;

// ─── Pricing ─────────────────────────────────────────────────────────────────

/** Fetch all pricing entries ordered by display order */
export const pricingQuery = `
  *[_type == "pricing"] | order(order asc) {
    _id,
    serviceName,
    serviceNameHindi,
    price,
    duration,
    includes,
    order
  }
`;

// ─── Health Videos ───────────────────────────────────────────────────────────

/** Fetch all health videos ordered by publish date */
export const healthVideosQuery = `
  *[_type == "healthVideo"] | order(publishDate desc) {
    _id,
    title,
    videoUrl,
    "videoFileUrl": videoFile.asset->url,
    category,
    duration,
    publishDate
  }
`;

/** Fetch health videos by category */
export const healthVideosByCategoryQuery = `
  *[_type == "healthVideo" && category == $category] | order(publishDate desc) {
    _id,
    title,
    videoUrl,
    "videoFileUrl": videoFile.asset->url,
    category,
    duration,
    publishDate
  }
`;
