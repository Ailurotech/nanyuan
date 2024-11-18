import { createSchema } from 'sanity';
import menu from './menu';
import order from './order';
import booking from './booking';
import homepage from './homepage';  
import { durationType } from './duration/durationType'; 
import { timeValueType } from './duration/timeValueType'; 
import { restaurant } from './restaurant'; 
import reservation from './reservation';


export const schemaTypes = [
  menu,
  order,
  booking,
  homepage,
  restaurant, 
  reservation,
  durationType, 
  timeValueType,
];
