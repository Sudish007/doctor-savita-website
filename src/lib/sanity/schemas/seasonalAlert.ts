const seasonalAlert = {
  name: 'seasonalAlert',
  title: 'Seasonal Alert',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'text',
      validation: (Rule: any) => Rule.required().max(200),
      description: 'Short alert message (max 200 characters)',
    },
    {
      name: 'activeMonths',
      title: 'Active Months',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Months when this alert is active (1=January, 12=December)',
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Seasonal icon identifier (e.g., "rain", "sun", "snow", "flower", "leaf")',
    },
    {
      name: 'relatedArticle',
      title: 'Related Article',
      type: 'reference',
      to: [{ type: 'article' }],
      description: 'Link to a related blog article for more information',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'body',
    },
  },
};

export default seasonalAlert;
