import Image from "next/image";
import { OpeningHoursContent } from "@/types"; 

type ImageWrapperProps = {
  photos: OpeningHoursContent["OpeninghourPhotos"];
};

function ImageWrapper({ photos }: ImageWrapperProps) {
  return (
    <>
      {photos.map((photo, index) => (
        <div key={index} className={`relative w-full h-full ${index === 1 ? 'row-span-2' : ''}`}>
          <Image
            src={photo.asset.url}
            alt={`Opening Hours Image ${index + 1}`}
            style={{ objectFit: 'cover' }}
            fill
          />
        </div>
      ))}
    </>
  );
}

export default ImageWrapper;
