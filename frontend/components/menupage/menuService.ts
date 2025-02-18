import { sanityClient } from '@/lib/sanityClient';
import { MenuItem, Category } from '@/types';

export const fetchMenuItems = async (
  cate: string,
  offset?: number,
  limit?: number,
  lastId?: string,
): Promise<MenuItem[]> => {
  try {
    const rangeQuery =
      offset !== undefined && limit !== undefined
        ? `[${offset}...${offset + limit}]`
        : '';

    const categoryFilter =
      cate !== 'All'
        ? `&& references(*[_type == "category" && name == "${cate}"]._id)`
        : '';

    const query = `
      *[_type == "menu" && isAvailable == true ${categoryFilter}]
      | order(_id asc) ${rangeQuery} {
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
  const query = `count(*[_type == "${docType}" && isAvailable == true])`;
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

export const fetchPageSize = async (): Promise<number> => {
  try {
    const query = `
      *[_type == "restaurant"][0] {
        pageSize
      }
    `;
    const result = await sanityClient.fetch<{ pageSize: number }>(query);
    return result?.pageSize ?? 50;
  } catch (error) {
    console.error('Error fetching page size:', error);
    return 50;
  }
};
