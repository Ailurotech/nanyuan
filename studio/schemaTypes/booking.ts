import {defineType} from 'sanity';

export default defineType({
  name: 'booking',
  title: 'Booking',
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
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'date',
      title: 'Booking Date',
      type: 'datetime',
    },
    {
      name: 'tableSize',
      title: 'Table Size',
      type: 'number',
    },
  ],
});
