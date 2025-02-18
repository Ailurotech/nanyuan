import { TakeawayPage } from '@/components/take-away-page/TakeawayPage';
import { sanityClient } from '@/lib/sanityClient';
import { Restaurant } from '@/types';
import { GetStaticProps } from 'next';

interface TakeawayProps {
  restaurant: Restaurant;
}

export default function Page({ restaurant }: TakeawayProps) {
  return <TakeawayPage restaurant={restaurant} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "restaurant"]{
    title,
    Weekdaytime { start, end },
    Weekandtime { start, end },
    blacklist
  }`;

  try {
    const data = await sanityClient.fetch(query);
    return { props: { restaurant: data[0] || null } };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { props: { restaurant: null } };
  }
};
