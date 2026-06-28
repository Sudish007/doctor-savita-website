const firstAidEntry = {
  name: 'firstAidEntry',
  title: 'First Aid Entry',
  type: 'document',
  fields: [
    {
      name: 'scenario',
      title: 'Scenario',
      type: 'string',
      description: 'The emergency scenario (e.g., "Burns", "Bee Sting")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'actionSteps',
      title: 'Action Steps',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Step-by-step first aid instructions',
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'remedy',
      title: 'Homeopathic Remedy',
      type: 'string',
      description: 'Recommended homeopathic remedy for this scenario',
    },
    {
      name: 'potency',
      title: 'Potency',
      type: 'string',
      description: 'Recommended potency (e.g., "30C", "200C")',
    },
    {
      name: 'dosage',
      title: 'Dosage',
      type: 'string',
      description: 'Dosage instructions',
    },
    {
      name: 'emergencyWarning',
      title: 'Emergency Warning',
      type: 'string',
      description: 'When to seek emergency medical care (Call 108)',
    },
    {
      name: 'translations',
      title: 'Translations',
      type: 'object',
      fields: [
        {
          name: 'hi',
          title: 'Hindi Translation',
          type: 'object',
          fields: [
            { name: 'scenario', title: 'Scenario (Hindi)', type: 'string' },
            { name: 'actionSteps', title: 'Action Steps (Hindi)', type: 'array', of: [{ type: 'string' }] },
            { name: 'remedy', title: 'Remedy (Hindi)', type: 'string' },
            { name: 'potency', title: 'Potency (Hindi)', type: 'string' },
            { name: 'dosage', title: 'Dosage (Hindi)', type: 'string' },
            { name: 'emergencyWarning', title: 'Emergency Warning (Hindi)', type: 'string' },
          ],
        },
        {
          name: 'bh',
          title: 'Bhojpuri Translation',
          type: 'object',
          fields: [
            { name: 'scenario', title: 'Scenario (Bhojpuri)', type: 'string' },
            { name: 'actionSteps', title: 'Action Steps (Bhojpuri)', type: 'array', of: [{ type: 'string' }] },
            { name: 'remedy', title: 'Remedy (Bhojpuri)', type: 'string' },
            { name: 'potency', title: 'Potency (Bhojpuri)', type: 'string' },
            { name: 'dosage', title: 'Dosage (Bhojpuri)', type: 'string' },
            { name: 'emergencyWarning', title: 'Emergency Warning (Bhojpuri)', type: 'string' },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'scenario',
      subtitle: 'remedy',
    },
  },
};

export default firstAidEntry;
