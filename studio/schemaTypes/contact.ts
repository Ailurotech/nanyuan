import { defineType } from 'sanity';

// Define the fields for the contact form
const contactFields = [
  { name: 'name', type: 'string' }, // Name field
  { name: 'phone', type: 'string' }, // Phone field
  { name: 'message', type: 'text' }, // Message field (using 'text' for multi-line input)
];
export default defineType({
  name: 'contact',
  title: 'Contact Form',
  type: 'document',
  fields: contactFields.map((field) => ({
    name: field.name,
    title: field.name.charAt(0).toUpperCase() + field.name.slice(1), // Capitalize the first letter for title
    type: field.type, // Use the defined type from the contactFields
  })),
});
