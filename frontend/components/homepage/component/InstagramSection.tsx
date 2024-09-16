import React from "react";
import InstagramEmbed from "@/components/homepage/component/InstagramEmbed";

interface InstagramContent {
  instagramUrls: { url: string; href?: string }[];
  heading: string;
  subheading: string;
}

interface InstagramSectionProps {
  content: InstagramContent;
}

const InstagramSection: React.FC<InstagramSectionProps> = ({ content }) => {
  const { instagramUrls, heading, subheading } = content;

  return (
    <div className="bg-[#1D1D1D] text-white py-20 flex flex-col gap-20">
      <div className="text-center">
        <a
          href="https://www.instagram.com/nan_yuan_restaurant/"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline text-white hover:text-gray-400"
        >
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold font-abhaya-libre">{heading}</h1>
            <h2 className="text-xl font-abhaya-libre px-4 sm:px-0">
              {subheading}
            </h2>
          </div>
        </a>
      </div>
      <div className="instagram-container px-3 sm:px-0">
        <InstagramEmbed urls={instagramUrls} />
      </div>
    </div>
  );
};

export default InstagramSection;
