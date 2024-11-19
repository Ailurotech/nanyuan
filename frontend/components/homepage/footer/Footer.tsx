import React from "react";
import InsEmbed from "./footer-component/InsEmbed";
import FooterInfo from "./footer-component/FooterInfo";
import { FooterContent } from "@/types";
interface FooterProps {
  footerContent: FooterContent; 
}


export default function Footer({ footerContent }: FooterProps) {
  return (
    <div className="w-full h-auto bg-[#1E1E1E]">
      <InsEmbed insEmbedId={footerContent.insEmbedId} />
      <FooterInfo footerContent={footerContent} />
    </div>
  );
}
