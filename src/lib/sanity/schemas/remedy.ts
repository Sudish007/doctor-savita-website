const remedy = {
  name: 'remedy',
  title: 'Remedy',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Plant', value: 'plant' },
          { title: 'Mineral', value: 'mineral' },
          { title: 'Animal', value: 'animal' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'primaryIndication',
      title: 'Primary Indication',
      type: 'string',
      description: 'The primary health condition this remedy addresses',
    },
    {
      name: 'funFact',
      title: 'Fun Fact',
      type: 'string',
      description: 'An interesting fact about this remedy',
    },
    {
      name: 'dosageNote',
      title: 'Dosage Note',
      type: 'string',
    },
    {
      name: 'applications',
      title: 'Applications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of conditions or uses this remedy can help with',
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order for rotation/display (lower numbers first)',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'primaryIndication',
      media: 'icon',
    },
  },
};

export default remedy;
