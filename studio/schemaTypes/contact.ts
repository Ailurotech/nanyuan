import { defineType } from 'sanity';

const contactFields = [
  { name: 'name', type: 'string' },
  { name: 'phone', type: 'string' }, 
  { name: 'message', type: 'text' }, 
];
export default defineType({
  name: 'contact',
  title: 'Contact Form',
  type: 'document',
  fields: contactFields.map((field) => ({
    name: field.name,
    title: field.name.charAt(0).toUpperCase() + field.name.slice(1),
    type: field.type,
  })),
});
