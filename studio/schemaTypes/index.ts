import { createSchema } from 'sanity';
import menu from './menu';
import category from './category';
import order from './order';
import booking from './booking';
import homepage from './homepage';  
import { durationType } from './duration/durationType'; 
import { timeValueType } from './duration/timeValueType'; 
import { restaurant } from './restaurant'; 

export const schemaTypes = [
  menu,
  category,
  order,
  booking,
  homepage,
  restaurant, 
  durationType, 
  timeValueType,
];
