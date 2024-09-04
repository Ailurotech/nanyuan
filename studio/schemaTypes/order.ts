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
      of: [{ type: 'reference', to: [{ type: 'menu' }] }],
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Delivered', value: 'delivered' },
        ],
        layout: 'dropdown',
      },
    },
  ],
});
