import { sanityClient } from '@/lib/sanityClient';
import { MenuItem, Category } from '@/types';

export const fetchMenuItemsByCate = async (
  cate: string,
  offset?: number,
  limit?: number
): Promise<MenuItem[]> => {
  try {
    const rangeQuery = cate === 'All' && offset !== undefined && limit !== undefined
      ? `[${offset}...${offset + limit}]` 
      : ''; 

    const categoryFilter = cate !== 'All'
      ? `&& references(*[_type == "category" && name == "${cate}"]._id)`
      : '';

    const query = `
      *[_type == "menu" ${categoryFilter}]
      | order(_createdAt desc) ${rangeQuery} {
        _id,
        name,
        description,
        price,
        categories[]->{name}, 
        isAvailable,
        "image": image.asset->url
      }
    `;
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};


export const fetchTotalCount = async (docType: string): Promise<number> => {
  const query = `count(*[_type == "${docType}"])`;
  return sanityClient.fetch(query);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const query = `
    *[_type == "category"] | order(_createdAt desc){
      name
    }
  `;
  return sanityClient.fetch(query);
};
