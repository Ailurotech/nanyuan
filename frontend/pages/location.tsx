import { sanityClient } from '@/lib/sanityClient';
import { GetStaticProps } from 'next';
import { LocationInfo } from '@/types';
import LocationMap from '@/components/location-page/LocationMap';
import ContactForm from '@/components/location-page/ContactForm';
import ImageSlider from '@/components/location-page/ImageCarousel';
import LocationHeader from '@/components/location-page/LocationDetails';

interface LocationPageProps {
  restaurantInfo: LocationInfo;
  mapUrl: string | null;
}

export default function LocationPage({
  restaurantInfo,
  mapUrl,
}: LocationPageProps) {
  if (!restaurantInfo) {
    return (
      <div className="text-center text-gray-600">
        Failed to load data. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191919] flex flex-col justify-center items-center p-0 pt-44">
      <div className="max-w-6xl w-full bg-[#e5e7ea] shadow-lg rounded-[2rem] overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]">
        <div className="md:w-3/5 flex justify-center items-center my-2">
          <ImageSlider images={restaurantInfo.images} />
        </div>

        <div className="flex flex-col p-6 h-auto md:h-full flex-1 justify-center items-center">
          <LocationHeader restaurantInfo={restaurantInfo} />
          <LocationMap mapUrl={mapUrl} />
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<{
  restaurantInfo: LocationInfo;
  mapUrl: string | null;
}> = async () => {
  try {
    const locationQuery = `*[_type == "location"][0]{title, address, phone, email, images[]{asset->{_id, url}, alt}}`;
    const homepageQuery = `*[_type == "HomePage"][0]{mapEmbedUrl}`;

    const [restaurantInfo, homepage] = await Promise.all([
      sanityClient.fetch<LocationInfo | null>(locationQuery),
      sanityClient.fetch<{ mapEmbedUrl?: string }>(homepageQuery),
    ]);

    if (!restaurantInfo) {
      return { notFound: true };
    }

    return {
      props: {
        restaurantInfo,
        mapUrl: homepage?.mapEmbedUrl ?? null,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { notFound: true };
  }
};
