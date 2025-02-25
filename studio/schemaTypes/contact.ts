import { defineType } from 'sanity';

const contactFields = ['name', 'phone', 'message'];

export default defineType({
  name: 'contact',
  title: 'Contact Form',
  type: 'document',
  fields: contactFields.map((fieldName) => ({
    name: fieldName,
    title: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
    type: 'string',
  })),
});
