import {defineType} from 'sanity';

export default defineType({
    name: 'location',
    title: 'Location',
    type: 'document',
    fields: [
      {
        name: 'title', // Field for the title
        type: 'string',
        title: 'Restaurant Name' // Human-readable label
      },
      {
        name: 'images',
        type: 'array',
        title: 'Images',
        of: [
          {
            type: 'image',
            options: { // Add options to the image type
              hotspot: true // If you want to use hotspots
            },
            fields: [ // Add fields to the image type
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative Text',
                description: 'Describe the image for accessibility and SEO',
                validation: (Rule) => Rule.required() // Alt text is usually required
              }
            ]
          }
        ]
      },
      {
        name: 'address',
        title: 'Address',
        type: 'string'
      },
      {
        name: 'phone',
        title: 'Phone',
        type: 'string'
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string'
      }
    ]
  })