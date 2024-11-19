import React from "react";
import InsEmbed from "./footer-component/InsEmbed";
import FooterInfo from "./footer-component/FooterInfo";
import { FooterContent } from "@/types";
import Image from "next/image";

interface FooterProps {
  footerContent: FooterContent;
}

export default function Footer({ footerContent }: FooterProps) {
  return (
    <div className="w-full h-auto bg-[#1E1E1E]">
      <div className="relative w-full h-[30vh] sm:h-[40vh] xl:h-[50vh] overflow-hidden mb-[5vh] sm:mb-[10vh]">
        <Image
          src={footerContent.topImage.asset.url}
          alt="topImage"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <InsEmbed insEmbedId={footerContent.insEmbedId} />
      <FooterInfo footerContent={footerContent} />
    </div>
  );
}
