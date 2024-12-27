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
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'Restaurant physical address.',
    },
    {
      name: 'locationTitle', 
      title: 'Location Title', 
      type: 'string',
    },
    {
      name: 'iframeSrc',
      title: 'Google Map Embed URL',
      type: 'url',
      description: 'The iframe URL for Google Maps.',
    },
    {
      name: 'Weekdaytime',
      title: 'Weekday Time',
      type: 'duration',
    },
    {
      name: 'Weekandtime',
      title: 'Weekend Time',
      type: 'duration',
    },
    {
      name: 'blacklist',
      title: 'Blacklist',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'pageSize',
      title: 'Page Size',
      type: 'number',
      description: 'Number of items to display per page.',
    },
  ],
});
