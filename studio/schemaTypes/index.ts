// schemaTypes/index.ts
import {createSchema} from 'sanity';
import menu from './menu';
import category from './category';
import order from './order';
import booking from './booking';

// Create and export the schema
export const schemaTypes = 
[menu, category, order, booking]
