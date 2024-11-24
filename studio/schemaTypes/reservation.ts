import { defineType } from 'sanity';

export default defineType({
  name: 'reservation',
  title: 'Reservation',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'string',
    },
    {
      name: 'time',
      title: 'Time',
      type: 'string',
    },
    {
      name: 'guests',
      title: 'Guests',
      type: 'string',
    },
    {
      name: 'table',
      title: 'Table',
      type: 'reference', 
      to: [{ type: 'table' }],
      description: 'The type of table assigned to this reservation.',
    },
    {
      name: 'preference',
      title: 'Preference',
      type: 'string',
    },
    {
      name: 'notes',
      title: 'Special Requests or Notes',
      type: 'string',
    },
  ],
});
