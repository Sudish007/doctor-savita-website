const pricing = {
  name: 'pricing',
  title: 'Treatment Pricing',
  type: 'document',
  fields: [
    {
      name: 'serviceName',
      title: 'Service Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'serviceNameHindi',
      title: 'Service Name (Hindi)',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Session duration (e.g., "30 minutes", "1 hour")',
    },
    {
      name: 'includes',
      title: 'Includes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What is included in this service',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which the pricing card appears (lower numbers first)',
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'serviceName',
      subtitle: 'price',
    },
    prepare({ title, subtitle }: { title: string; subtitle: number }) {
      return {
        title,
        subtitle: subtitle != null ? `₹${subtitle}` : 'No price set',
      };
    },
  },
};

export default pricing;
