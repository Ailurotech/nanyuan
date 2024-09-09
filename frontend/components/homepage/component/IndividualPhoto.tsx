import { GalleryPhoto } from "@/types";
import clsx from "clsx";
import Image from "next/image";

interface IndividualPhotoProps {
  photo: GalleryPhoto;
  isColor?: boolean;
  index: number;
}

export function IndividualPhoto({
  photo,
  isColor = false,
  index,
}: IndividualPhotoProps) {
  return (
    <div key={index} className="relative">
      <Image
        src={photo.asset.url}
        alt="Gallery Photo"
        fill
        objectFit="cover"
        className={clsx(isColor ? "" : "grayscale hover:grayscale-0")}
      />
    </div>
  );
}
