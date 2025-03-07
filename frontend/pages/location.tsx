import { sanityClient } from '@/lib/sanityClient';
import { GetStaticProps } from 'next';
import { LocationInfo } from '@/types';
import LocationMap from '@/components/location-page/LocationMap';
import ContactForm from '@/components/location-page/ContactForm';
import ImageSlider from '@/components/location-page/ImageCarousel';
import LocationHeader from '@/components/location-page/LocationDetails';

interface LocationPageProps {
  restaurantInfo: LocationInfo;
}

export default function LocationPage({ restaurantInfo }: LocationPageProps) {
  if (!restaurantInfo) {
    return (
      <div className="text-center text-gray-600">
        Failed to load data. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191919] flex flex-col justify-center items-center p-6 pt-44">
      <div className="max-w-6xl w-full bg-[#e5e7ea] shadow-lg rounded-[4rem] overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]">
        <ImageSlider images={restaurantInfo.images} />
        <div className="md:w-1/2 flex flex-col p-6 h-auto md:h-full">
          <LocationHeader restaurantInfo={restaurantInfo} />
          <LocationMap />
        </div>
      </div>
      <ContactForm />
    </div>
  );
}

export const getStaticProps: GetStaticProps<{
  restaurantInfo: LocationInfo;
}> = async () => {
  const query = `*[_type == "location"][0]{title, address, phone, email, images[]{asset->{_id, url}, alt}}`;
  const restaurantInfo = await sanityClient.fetch<LocationInfo>(query);
  return { props: { restaurantInfo } };
};
