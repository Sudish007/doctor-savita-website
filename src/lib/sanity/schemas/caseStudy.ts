import { HEALTH_CATEGORIES } from './constants';

const caseStudy = {
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    {
      name: 'condition',
      title: 'Condition',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: HEALTH_CATEGORIES.map((cat) => ({ title: cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), value: cat })),
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'duration',
      title: 'Treatment Duration',
      type: 'string',
      description: 'e.g., "3 months", "6 weeks"',
    },
    {
      name: 'outcomeSummary',
      title: 'Outcome Summary',
      type: 'text',
      description: 'Brief summary of the treatment outcome',
    },
    {
      name: 'narrative',
      title: 'Full Narrative',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    },
    {
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'improvementPercentage',
      title: 'Improvement Percentage',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(100),
    },
    {
      name: 'consentConfirmed',
      title: 'Patient Consent Confirmed',
      type: 'boolean',
      description: 'Confirm that patient has given consent to share this case study',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'condition',
      subtitle: 'category',
      media: 'beforeImage',
    },
  },
};

export default caseStudy;
