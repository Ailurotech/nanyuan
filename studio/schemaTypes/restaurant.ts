import { defineType } from 'sanity';



export const restaurant = defineType({
  name: 'restaurant',
  title: 'Restaurant',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'Weekdaytime', 
      title: 'Weekdaytime', 
      type: 'duration', 
    },
    {
      name: 'Weekandtime', 
      title: 'Weekandtime', 
      type: 'duration', 
    },
    {
      name: 'blacklist', 
      title: 'Blacklist',
      type: 'array', 
      of: [{ type: 'string' }], 
    },
  ],
});
