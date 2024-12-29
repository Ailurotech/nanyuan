import { defineType } from 'sanity';

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'items',
      title: 'Ordered Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'menuItem',
              title: 'Menu Item',
              type: 'reference',
              to: [{ type: 'menu' }],
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.min(1).required(),
            },
          ],
          preview: {
            select: {
              title: 'menuItem.name', 
              media: 'menuItem.image', 
              quantity: 'quantity', 
            },
            prepare(selection) {
              const { title, media, quantity } = selection;
              return {
                title: `${title} (x${quantity})`, 
                media, 
              };
            },
          },
        },
      ],
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'Pending' },
          { title: 'Paid', value: 'Paid' },
          { title: 'Cancelled', value: 'Cancelled' },
          { title: 'Offline', value: 'Offline' },
        ],
        layout: 'dropdown',
      },
    },
  ],
});
