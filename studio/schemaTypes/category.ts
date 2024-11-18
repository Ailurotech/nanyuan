import { defineType } from 'sanity';

export default defineType({
  name: 'category', 
  title: 'Category', 
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The name of the category.',
      validation: (Rule) => Rule.required().min(2).max(50), 
    },
  ],
});