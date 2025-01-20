import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
  apiVersion: '2023-09-01',
  token: process.env.SANITY_API_TOKEN,
});
const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => builder.image(source);
