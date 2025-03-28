import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';

interface ImageSliderProps {
  images: { asset: { _id: string; url: string }; alt?: string }[];
  intervalTime?: number;
}

export default function ImageSlider({
  images,
  intervalTime = 5000,
}: ImageSliderProps) {
  if (!images || images.length === 0) {
    console.warn('No images provided to ImageSlider.');
    return null;
  }

  return (
    <div className="w-full max-w-[800px] mx-auto my-0 px-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: intervalTime, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="rounded-[2rem]"
      >
        {images.map((img) => (
          <SwiperSlide key={img.asset._id}>
            <div className="relative w-full aspect-[4/3] md:h-[540px] flex justify-center items-center">
              <Image
                src={img.asset.url}
                alt={img.alt || 'Location Image'}
                className="object-cover rounded-[2rem]"
                fill
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
