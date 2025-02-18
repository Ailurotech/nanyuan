import { defineType } from 'sanity';

export default defineType({
  name: 'contact',
  title: 'Contact Messages',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name'
    },
    {
      name: 'phone',
      type: 'string',
      title: 'Phone Number'
    },
    {
      name: 'message',
      type: 'text',
      title: 'Message'
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Submitted At',
      options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' },
    }
  ]
});
