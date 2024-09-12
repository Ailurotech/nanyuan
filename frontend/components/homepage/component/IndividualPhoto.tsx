import { SinglePhoto } from "@/types";
import clsx from "clsx";
import Image from "next/image";
import { NavigationRoute } from "../route";

interface IndividualPhotoProps {
  photo: SinglePhoto;
  isColor?: boolean;
}

export function IndividualPhoto({
  photo,
  isColor = false,
}: IndividualPhotoProps) {
  return (
    <div className="relative">
      <NavigationRoute.Menu.Link className="cursor-pointer">
        <Image
          src={photo.asset.url}
          alt="Gallery Photo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={clsx(
            "duration-500",
            isColor ? "hover:grayscale" : "grayscale hover:grayscale-0"
          )}
        />
      </NavigationRoute.Menu.Link>
    </div>
  );
}
