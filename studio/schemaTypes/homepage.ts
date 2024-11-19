import {defineType} from 'sanity'

export default defineType({
  name: 'HomePage',
  title: 'HomePage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Content' },
    { name: 'openinghours', title: 'Opening Hours' },
    { name: 'instagram', title: 'Instagram' },
    { name: 'footer', title: 'Footer' },
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
      name: 'OpeninghourPhotos',
      title: 'OpeninghourPhotos',
      type: 'array',
      of: [{type: 'image'}],
      group: 'openinghours',
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Customer Name',
              type: 'string',
            },
            {
              name: 'review',
              title: 'Review',
              type: 'text',
            },
            {
              name: 'image',
              title: 'Customer Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
      group: 'openinghours',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      group: 'footer',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'footer',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'footer',
    },
    {
      name: 'copyright',
      title: 'Copyright',
      type: 'string',
      group: 'footer',
    },
    {
      name: 'mapEmbedUrl',
      title: 'Map Embed URL',
      type: 'string',
      group: 'footer',
    },
    {
      name: 'insEmbedId',
      title: 'Instagram Embed ID',
      type: 'string',
      group: 'footer',
    },
  ],
});
