import {defineType} from 'sanity'

export default defineType({
  name: 'HomePage',
  title: 'HomePage',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'content', title: 'Content'},
    { name: 'instagram', title: 'Instagram' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'backgroundimg',
      title: 'Background Image',
      type: 'image',
      group: 'hero',
    },
    {
      name: 'dishimg',
      title: 'Dish Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'hero',
    },
    {
      name: 'cheftext',
      title: 'Chef Text',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'chefname',
      title: 'Chef Name',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'Homepagetitle',
      title: 'Homepage Title',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'galleryPhotos',
      title: 'Gallery Photos',
      type: 'array',
      of: [{type: 'image'}],
      group: 'content',
    },
    {
      name: 'menuName',
      title: 'Menu Name',
      type: 'string',
      group: 'content',
    },
    {
      name: 'menuDescription',
      title: 'Menu Description',
      type: 'array',
      of: [{type: 'block'}],
      group: 'content',
    },
    {
      name: 'menuLink',
      title: 'Menu Link Name',
      type: 'string',
      group: 'content',
    },
    {
      name: 'instagramContent',
      title: 'Instagram Content',
      type: 'object',
      group: 'instagram',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'subheading', title: 'Subheading', type: 'string' },
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
    },
  ],
});