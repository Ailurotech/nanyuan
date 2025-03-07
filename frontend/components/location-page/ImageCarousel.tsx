import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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

  // 调试日志：检查传入的 images 数组
  useEffect(() => {
    console.log('Received images:', images);
  }, [images]);

  useEffect(() => {
    if (!images || images.length === 0) {
      console.warn('No images provided to ImageSlider.');
      return;
    }

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
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto my-8 px-8">
      {/* 图片容器 */}
      <div className="relative w-full h-[620px] overflow-hidden rounded-[4rem]">
        {images.map((img, index) => (
          <Image
            key={img.asset._id}
            src={img.asset.url}
            alt={img.alt || `Location Image ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 rounded-[4rem] ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            width={500}
            height={600}
            priority={index === 0}
          />
        ))}
      </div>

      {/* 小圆点导航 */}
      <div className="flex space-x-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentImageIndex ? 'bg-black scale-125' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
