// schemaTypes/index.ts
import {createSchema} from 'sanity';
import menu from './menu';
import category from './category';
import order from './order';
import booking from './booking';
import homepage from './homepage';  


export const schemaTypes = [
  menu,
  category,
  order,
  booking,
  homepage,  
];
