export { HEALTH_CATEGORIES, type HealthCategory } from './constants';

import article from './article';
import remedy from './remedy';
import caseStudy from './caseStudy';
import firstAidEntry from './firstAidEntry';
import seasonalAlert from './seasonalAlert';
import healthCalendarDate from './healthCalendarDate';
import pricing from './pricing';
import healthVideo from './healthVideo';

/**
 * All Sanity CMS schemas for the doctor website.
 */
export const schemas = [
  article,
  remedy,
  caseStudy,
  firstAidEntry,
  seasonalAlert,
  healthCalendarDate,
  pricing,
  healthVideo,
];

export {
  article,
  remedy,
  caseStudy,
  firstAidEntry,
  seasonalAlert,
  healthCalendarDate,
  pricing,
  healthVideo,
};
