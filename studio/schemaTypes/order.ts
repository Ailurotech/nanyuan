import {defineType} from 'sanity';

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(15),
    },
    {
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
            {name: 'price', title: 'Price', type: 'number'},
          ],
          preview: {
            select: {
              title: 'menuItem.name', 
              media: 'menuItem.image', 
              quantity: 'quantity', 
              price: 'price',
            },
            prepare(selection) {
              const { title, media, quantity, price } = selection;
              return {
                title: `${title} (x${quantity}) ${price} dollars`, 
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
      validation: (Rule) => Rule.min(0).required(),
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Offline', value: 'offline' },
          { title: 'Online', value: 'online' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'notes',
      title: 'Special Requests / Notes',
      type: 'text',
    },
    {
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      hidden: ({ document }) => document?.paymentMethod !== 'online',
    },
  ],
});
