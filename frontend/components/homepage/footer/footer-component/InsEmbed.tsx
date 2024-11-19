import React from "react";
import BeholdWidget from "@behold/react"
import { Abhaya_Libre } from "next/font/google";

const abhayaLibre = Abhaya_Libre({ weight: "400", subsets: ["latin"] });

export default function InsEmbed({ insEmbedId }: { insEmbedId: string }) {
    
  return (
    <div className={`w-[90vw] md:w-[70%] mx-auto h-[auto] text-white md:mb-[100px] mb-[50px] ${abhayaLibre.className}`}>
      <h1 className="text-center md:text-[4rem] text-[2rem] font-bold">Go Check our Instagram</h1>
      <h3 className="text-center md:text-[2rem] text-[1rem] font-normal mb-[5vh]">Follow us for more updates</h3>
      <BeholdWidget feedId={insEmbedId} />
    </div>
  );
}
