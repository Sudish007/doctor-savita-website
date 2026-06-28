import { HEALTH_CATEGORIES } from './constants';

const article = {
  name: 'article',
  title: 'Blog Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required().max(200),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
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
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule: any) => Rule.max(10),
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Scheduled', value: 'scheduled' },
        ],
      },
      initialValue: 'draft',
    },
    {
      name: 'scheduledDate',
      title: 'Scheduled Publish Date',
      type: 'datetime',
      hidden: ({ parent }: { parent: { status?: string } }) => parent?.status !== 'scheduled',
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Hindi', value: 'hi' },
          { title: 'Bhojpuri', value: 'bh' },
        ],
      },
      initialValue: 'en',
    },
    {
      name: 'hindiTitle',
      title: 'Hindi Title',
      type: 'string',
    },
    {
      name: 'hindiBody',
      title: 'Hindi Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage',
      status: 'status',
    },
    prepare({ title, media, status }: { title: string; media: any; status: string }) {
      return {
        title,
        subtitle: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft',
        media,
      };
    },
  },
};

export default article;
