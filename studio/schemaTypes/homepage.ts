import { defineType } from 'sanity';

export default defineType({
  name: 'HomePageContent',
  title: 'HomePageContent',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'backgroundimg',
      title: 'Background Image',
      type: 'image', 
    },
    {
      name: 'dishimg',
      title: 'Dish Image',
      type: 'image', 
      options: {
        hotspot: true,
      },
    },
    {
      name: 'cheftext',
      title: 'Chef Text',
      type: 'string',
    },
    {
      name: 'chefname',
      title: 'Chef Name',
      type: 'string',
    },
    {
      name: 'Homepagetitle',
      title: 'Homepage Title',
      type: 'string',
    },
  ],
});
