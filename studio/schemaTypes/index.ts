import { createSchema } from 'sanity';
import menu from './menu';
import category from './category';
import order from './order';
import homepage from './homepage';  
import { durationType } from './duration/durationType'; 
import { timeValueType } from './duration/timeValueType'; 
import { restaurant } from './restaurant'; 
import reservation from './reservation';
import table from './table';


export const schemaTypes = [
  menu,
  category,
  order,
  table,
  homepage,
  restaurant, 
  reservation,
  durationType, 
  timeValueType,
];
