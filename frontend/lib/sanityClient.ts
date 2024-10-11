import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'utvt9caf',
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
  apiVersion: '2023-09-01',
  token: process.env.SANITY_API_TOKEN,
});
