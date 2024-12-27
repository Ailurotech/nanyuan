import { useRouter } from 'next/router';
import Map from '../../components/common/Map';
import { SocialRoute } from '../../components/homepage/route';
import { fetchRestaurantLocation } from '@/lib/queries';

function SuccessBookTable({ locationDetails }: { locationDetails: any }) {
  const router = useRouter();
  const { name, date, time } = router.query;

  return (
    <div className="bg-black w-full min-h-screen h-auto pt-[20vh] text-yellow-500">
      <div className="mx-auto w-[60%] h-auto flex flex-col gap-x-[8%] md:flex-row">
        <div className="flex-1">
          <h1 className="text-[40px] capitalize font-bold">
            Thank you, {name}!
          </h1>
          <p className="mt-4 text-md">
            We are thrilled to confirm your table booking scheduled for{' '}
            <span className="font-bold">{date} at {time}</span>. Your reservation has been recorded, and we are preparing for your visit.
          </p>
          <p className="mt-4 text-md">
            Follow us on{' '}
            <a
              href={SocialRoute.Instagram.Path}
              target="_blank"
              className="underline"
            >
              Instagram
            </a>{' '}
            for the latest updates and specials, and if you have any questions, feel free to call us at{' '}
            <a href="tel:+61882713133" className="font-bold underline">
              (08) 8271 3133
            </a>.
          </p>
          <Map
            title={locationDetails.locationTitle || 'Location Map'}
            address={locationDetails.address}
            iframeSrc={locationDetails.iframeSrc}
          />
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const locationDetails = await fetchRestaurantLocation();

  return {
    props: {
      locationDetails,
    },
  };
}

export default SuccessBookTable;
