import dynamic from 'next/dynamic';
import { fetchRestaurantLocation } from '@/lib/queries';

const SuccessTakeawayNoSSR = dynamic(() => import('../../components/success/SuccessTakeaway'), {
  ssr: false,
});

export default function SuccessTakeawayPage({ locationDetails }: { locationDetails: any }) {
  return <SuccessTakeawayNoSSR locationDetails={locationDetails} />;
}

export async function getStaticProps() {
  // 从 Sanity 获取餐厅位置信息
  const locationDetails = await fetchRestaurantLocation();

  return {
    props: {
      locationDetails,
    },
  };
}
