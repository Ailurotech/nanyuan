import menu from './menu';
import order from './order';
import booking from './booking';
import homepage from './homepage';  
import category from './category';
import { durationType } from './duration/durationType'; 
import { timeValueType } from './duration/timeValueType'; 
import { restaurant } from './restaurant'; 
import reservation from './reservation';
import table from './table';
import location from './location';

export const schemaTypes = [
  menu,
  table,
  category,
  order,
  booking,
  homepage,
  restaurant, 
  reservation,
  durationType, 
  timeValueType,
  location,
];
