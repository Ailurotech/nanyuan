import React from "react";
import Link from "next/link";
import Image from "next/image";

interface InstagramEmbedProps {
  urls: { url: string; href?: string }[];
}

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ urls }) => {
  const numRows = 2;
  const columns = {
    base: 2,
    sm: 3,
    md: 4,
    lg: 6,
  };

  const getMaxImagesToShow = (columns: number) => numRows * columns;

  const maxImagesToShowBase = getMaxImagesToShow(columns.base);
  const maxImagesToShowSm = getMaxImagesToShow(columns.sm);
  const maxImagesToShowMd = getMaxImagesToShow(columns.md);
  const maxImagesToShowLg = getMaxImagesToShow(columns.lg);

  const [maxImagesToShow, setMaxImagesToShow] =
    React.useState(maxImagesToShowLg);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setMaxImagesToShow(maxImagesToShowBase);
      } else if (window.innerWidth < 768) {
        setMaxImagesToShow(maxImagesToShowSm);
      } else if (window.innerWidth < 1024) {
        setMaxImagesToShow(maxImagesToShowMd);
      } else {
        setMaxImagesToShow(maxImagesToShowLg);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    maxImagesToShowBase,
    maxImagesToShowSm,
    maxImagesToShowMd,
    maxImagesToShowLg,
  ]);

  const limitedUrls = urls.slice(0, maxImagesToShow);

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0`}
    >
      {limitedUrls.map((item, index) => (
        <div key={index} className="relative aspect-square">
          {item.href ? (
            <Link href={item.href} passHref>
              <Image
                src={item.url}
                alt="Instagram post"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </Link>
          ) : (
            <Image
              src={item.url}
              alt="Instagram post"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default InstagramEmbed;
