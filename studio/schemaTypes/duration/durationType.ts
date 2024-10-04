import { defineField, defineType } from 'sanity';
import { timeValueType } from './timeValueType'; 

export const durationType = defineType({
  name: 'duration',
  title: 'Duration',
  description: 'A start and finish time for a promotion',
  type: 'object',
  fields: [
    defineField({
      name: 'start',
      title: 'Start Time', 
      type: 'timeValue', 
    }),
    defineField({
      name: 'end',
      title: 'End Time', 
      type: 'timeValue', 
    }),
  ],
  options: { columns: 2 }, // 将字段并排显示
});
