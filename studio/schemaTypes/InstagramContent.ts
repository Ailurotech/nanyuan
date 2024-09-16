import { defineType } from 'sanity';

export default defineType({
  name: 'instagramContent',
  title: 'Instagram Content',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Heading text for the Instagram section',
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Subheading text for the Instagram section',
    },
    {
      name: 'instagramUrls',
      title: 'Instagram URLs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'url', type: 'url', title: 'Image URL' },
            { name: 'href', type: 'url', title: 'Link URL' },
          ],
        },
      ],
    },
  ],
});
