import {createClient} from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'utvt9caf',  
  dataset: 'test', 
  useCdn: true,
  apiVersion: '2023-09-01',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN || undefined,
});