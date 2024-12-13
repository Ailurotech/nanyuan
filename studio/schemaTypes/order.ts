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
          { title: 'Cash', value: 'Cash' }, 
        ],
        layout: 'dropdown',
      },
    },
  ],
});
