import {defineType} from 'sanity'

export default defineType({
  name: 'HomePageContent',
  title: 'HomePageContent',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'content', title: 'Content'},
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
  ],
})
