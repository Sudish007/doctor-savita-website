const healthCalendarDate = {
  name: 'healthCalendarDate',
  title: 'Health Calendar Date',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Health awareness day name (e.g., "World Health Day")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'The calendar date for this health awareness day',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'templateArticle',
      title: 'Template Article',
      type: 'reference',
      to: [{ type: 'article' }],
      description: 'Pre-written template article to auto-publish on this date',
    },
    {
      name: 'customArticle',
      title: 'Custom Article',
      type: 'reference',
      to: [{ type: 'article' }],
      description: 'Custom article override (takes priority over template)',
    },
    {
      name: 'isEnabled',
      title: 'Enabled',
      type: 'boolean',
      description: 'Toggle to enable/disable auto-publishing for this date',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'date',
    },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) : 'No date set',
      };
    },
  },
};

export default healthCalendarDate;
