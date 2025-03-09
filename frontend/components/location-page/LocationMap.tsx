import { GetStaticProps } from 'next';
import { sanityClient } from '@/lib/sanityClient';

interface LocationProps {
  mapUrl: string | null;
}
export default function LocationMap({ mapUrl }: LocationProps) {
  return (
    <div className="relative mx-auto w-full h-80 rounded-lg overflow-hidden">
      {mapUrl ? (
        <iframe
          title="Restaurant Location"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: '0' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      ) : (
        <div className="text-center text-gray-500">Map not available</div>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const query = `*[_type == "HomePage"][0] { mapEmbedUrl }`;
    const data = await sanityClient.fetch(query);

    if (process.env.NODE_ENV === 'development') {
      console.log('Fetched Map URL:', data?.mapEmbedUrl);
    }

    return {
      props: {
        mapUrl: data?.mapEmbedUrl || null,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching map URL:', error);
    }

    return {
      props: {
        mapUrl: null,
      },
    };
  }
};
