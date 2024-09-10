import clsx from "clsx";
import Image from "next/image";

interface IndividualPhotoProps {
  photo: any;
  isColor?: boolean;
}

export function IndividualPhoto({
  photo,
  isColor = false,
}: IndividualPhotoProps) {
  return (
    <div className="relative">
      <Image
        src={photo.asset.url}
        alt="Gallery Photo"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={clsx(isColor ? "" : "grayscale hover:grayscale-0")}
      />
    </div>
  );
}
