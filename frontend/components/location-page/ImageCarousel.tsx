import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { LocationInfo } from '@/types';

interface ImageSliderProps {
  images: { asset: { _id: string; url: string }; alt?: string }[];
  intervalTime?: number;
}

export default function ImageSlider({
  images,
  intervalTime = 5000,
}: ImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!images.length) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, intervalTime);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [images.length, intervalTime]);

  return (
    <div className="relative">
      {images.map((img, index) => (
        <Image
          key={img.asset._id}
          src={img.asset.url}
          alt={img.alt || `Location Image ${index + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          width={400}
          height={300}
          priority={index === 0}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentImageIndex ? 'bg-black' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
