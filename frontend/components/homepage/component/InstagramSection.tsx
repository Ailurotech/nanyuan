import React from "react";
import InstagramEmbed from "@/components/homepage/component/InstagramEmbed";

interface InstagramSectionProps {
  instagramUrls: { url: string; href?: string }[];
  heading: string;
  subheading: string;
}

const InstagramSection: React.FC<InstagramSectionProps> = ({
  instagramUrls,
  heading,
  subheading,
}) => {
  return (
    <div className="bg-[#1D1D1D] text-white py-10">
      <div className="text-center mb-10">
        <a
          href="https://www.instagram.com/nan_yuan_restaurant/"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline text-white hover:text-gray-400"
        >
          <h1 className="text-4xl font-bold mt-10 mb-2 font-abhaya-libre">
            {heading}
          </h1>
          <h2 className="text-xl mt-5 font-abhaya-libre">{subheading}</h2>
        </a>
      </div>
      <div className="instagram-container py-10 mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0">
          {instagramUrls && instagramUrls.length > 0 ? (
            instagramUrls.slice(0, 12).map((item, index) => (
              <div key={index} className="relative">
                <InstagramEmbed url={item.url} href={item.href} />
              </div>
            ))
          ) : (
            <p className="text-center text-white">
              No Instagram content available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstagramSection;
