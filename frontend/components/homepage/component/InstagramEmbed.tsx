import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface InstagramEmbedProps {
  urls: { url: string; href?: string }[];
}

const breakpoints = [
  { maxWidth: 640, columns: 2 },
  { maxWidth: 768, columns: 3 },
  { maxWidth: 1024, columns: 4 },
  { maxWidth: Infinity, columns: 6 },
];

const getColumnsForWidth = (width: number) => {
  const breakpoint = breakpoints.find(({ maxWidth }) => width < maxWidth);
  return breakpoint
    ? breakpoint.columns
    : breakpoints[breakpoints.length - 1].columns;
};

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ urls }) => {
  const numRows = 2;
  const [columns, setColumns] = useState<number>(2);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setColumns(getColumnsForWidth(window.innerWidth));
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const maxImagesToShow = numRows * columns;
  const limitedUrls = urls.slice(0, maxImagesToShow);

  return (
    <div
      className={`grid gap-0`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {limitedUrls.map((item, index) => (
        <div key={index} className="relative aspect-square">
          {item.href ? (
            <Link href={item.href}>
              <Image
                src={item.url}
                alt="Instagram post"
                fill
                className="w-full h-full"
                style={{ objectFit: "cover" }}
              />
            </Link>
          ) : (
            <Image
              src={item.url}
              alt="Instagram post"
              fill
              className="w-full h-full"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default InstagramEmbed;
