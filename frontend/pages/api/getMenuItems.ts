import { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../lib/sanityClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { category } = req.query;


  const filter = category ? `&& categories match "${category}*"` : '';
  const query = `
    *[_type == "menu" ${filter}] | order(_createdAt desc){
      _id,
      name,
      description,
      price,
      categories,
      isAvailable, 
      "image": image.asset->url
    }
  `;

  try {
    const menuItems = await sanityClient.fetch(query);
    res.status(200).json({ menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
