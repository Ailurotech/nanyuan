import { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanityClient';

const LocationMap = () => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = `*[_type == "HomePage"][0] { mapEmbedUrl }`;

    sanityClient
      .fetch(query)
      .then((data) => {
        if (data && data.mapEmbedUrl) {
          setMapUrl(data.mapEmbedUrl);
          setError(null);
        } else {
          setError('Map URL not found in the data');
        }
      })
      .catch(() => {
        setError('Failed to fetch map URL');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading map...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

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
};

export default LocationMap;
