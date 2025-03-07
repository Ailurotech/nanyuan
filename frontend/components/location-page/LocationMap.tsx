import { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanityClient';

const LocationMap = () => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  useEffect(() => {
    const query = `*[_type == "HomePage"][0] { mapEmbedUrl }`;

    sanityClient
      .fetch(query)
      .then((data) => {
        console.log('Sanity Data:', data); // 查看返回的数据结构
        if (data && data.mapEmbedUrl) {
          setMapUrl(data.mapEmbedUrl);
        } else {
          console.warn('No mapEmbedUrl found in Sanity data');
        }
      })
      .catch((err) => {
        console.error('Error fetching map URL:', err);
      });
  }, []);

  return (
    <div className=" relative mx-auto w-full h-80 rounded-lg overflow-hidden">
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
};

export default LocationMap;
