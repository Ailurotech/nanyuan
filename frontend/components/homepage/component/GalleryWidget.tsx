import { GalleryPhoto } from "@/types";
import { IndividualPhoto } from "./IndividualPhoto";
import Image from "next/image";

type GalleryWidgetProps = {
  galleryPhotos: GalleryPhoto[];
};

export function GalleryWidget({ galleryPhotos }: GalleryWidgetProps) {
  console.log("123", galleryPhotos);
  return (
    <div className="grid bg-slate-500 w-[70%] aspect-[4/3] m-auto -translate-y-[20%] grid-cols-4 grid-rows-3">
      {galleryPhotos.map((photo, index) => {
        switch (index) {
          case 0:
            return (
              <IndividualPhoto
                key={index}
                photo={photo}
                isColor
                index={index}
              />
            );
          case 6:
            return (
              <>
                <div key={index} className="relative col-span-2 bg-white">
                  123123123
                </div>
                <IndividualPhoto key={index} photo={photo} index={index} />
              </>
            );
          default:
            return <IndividualPhoto key={index} photo={photo} index={index} />;
        }
      })}
    </div>
  );
}

// if (index === 0) {
//   return (
//     <div key={index} className="relative">
//       <Image
//         src={photo.asset.url}
//         alt="Gallery Photo"
//         fill
//         objectFit="cover"
//       />
//     </div>
//   );
// }
// if (index === 6) {
//   return (
//     <div key={index} className="relative col-span-2 bg-white"></div>
//   );
// }
// return (
//   <div key={index} className="relative">
//     <Image
//       src={photo.asset.url}
//       alt="Gallery Photo"
//       fill
//       objectFit="cover"
//       className="grayscale hover:grayscale-0"
//     />
//   </div>
// );
