import { defineType } from 'sanity';

export default defineType({
  name: 'table',
  title: 'Table',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Table Type',
      type: 'string',
      options: {
        list: [
          { title: '2-person Table', value: '2'},
          { title: '4-person Table', value: '4' },
          { title: '10-person Table', value: '10' },
          { title: '25-person Table', value: '25' },
        ],
      },
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      description: 'Total number of this type of table in the restaurant',
    },
  ],
});
