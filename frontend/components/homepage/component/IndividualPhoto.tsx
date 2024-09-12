import { SinglePhoto } from "@/types";
import clsx from "clsx";
import Image from "next/image";
import { NavigationRoute } from "../route";
import React from "react";

interface IndividualPhotoProps {
  photo: SinglePhoto;
  isColor?: boolean;
  onHover?: (isHovered: boolean) => void;
}

export function IndividualPhoto({
  photo,
  isColor = false,
  onHover,
}: IndividualPhotoProps) {
  const handleMouseEnter = () => {
    onHover && onHover(true);
  };

  const handleMouseLeave = () => {
    onHover && onHover(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
