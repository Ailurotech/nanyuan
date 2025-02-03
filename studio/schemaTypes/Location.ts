import {defineType} from 'sanity';

export default defineType({
    name: 'contactUs',
    title: 'ContactUs',
    type: 'document',
    fields: [
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