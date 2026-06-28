import { HEALTH_CATEGORIES } from './constants';

const healthVideo = {
  name: 'healthVideo',
  title: 'Health Video',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube Shorts, Instagram Reels, or other video URL',
      validation: (Rule: any) =>
        Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      description: 'Direct MP4 upload (alternative to URL)',
      options: {
        accept: 'video/*',
      },
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: HEALTH_CATEGORIES.map((cat) => ({ title: cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), value: cat })),
      },
    },
    {
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      description: 'Video duration in seconds',
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
};

export default healthVideo;
