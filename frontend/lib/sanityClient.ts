import {createClient} from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'utvt9caf',  
  dataset: 'test', 
  useCdn: true,
  apiVersion: '2023-09-01',
});