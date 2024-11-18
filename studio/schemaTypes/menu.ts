import { defineType } from 'sanity';

export default defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Dish Name',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Entree', value: 'Entree' },
          { title: 'Soup', value: 'Soup' },
          { title: 'Beef & Lamb', value: 'Beef&Lamb' },
          { title: 'Chicken', value: 'Chicken' },
          { title: 'Duck', value: 'Duck' },
          { title: 'Seafood', value: 'Seafood' },
          { title: 'Tofu & Claypot', value: 'Tofu&Claypot' },
          { title: 'Noodle & Rice', value: 'Noodle&Rice' },
          { title: 'Signature', value: 'Signature' }, 
        ],
      },
    },
    {
      name: 'isAvailable',
      title: 'Available',
      type: 'boolean',
    },
  ],
});
