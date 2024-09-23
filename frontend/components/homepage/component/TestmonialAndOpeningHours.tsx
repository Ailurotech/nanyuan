import OpeningHoursList from "./TestimoialAndOpeningHoursComponent/OpeningHoursList";
import { OpeningHoursContent } from "@/types";
import ImageWrapper from "./TestimoialAndOpeningHoursComponent/ImageWrapper";
import Image from "next/image";
import TestimonialSlider from "./TestimoialAndOpeningHoursComponent/TestimonialSlider";
import logo from "@/public/logo.png";
import { Abhaya_Libre } from 'next/font/google';

type openingHourProps = {
  openingHourContent: OpeningHoursContent;
};

const abhayaLibre = Abhaya_Libre({weight: '400',subsets: ['latin'],});

export default function TestmonialAndOpeningHours({ openingHourContent }: openingHourProps) {
  return (
    <div className={`px-[8%] py-[5%] sm:px-[16%] bg-[#1E1E1E] text-white justify-center items-center ${abhayaLibre.className}`}>
      <div className="min-h-[30vh] flex flex-col gap-x-[8%] gap-y-[20px] md:flex-row">
        <div className="w-full">
          <h1 className="text-[3rem] sm:text-[2.5rem] xl:text-[3.7em] whitespace-nowrap">Opening Hours</h1>
          <div className="mt-[6%]">
            <OpeningHoursList openingHours={openingHourContent?.openingHours} />
          </div>
        </div>
        <div className="h-[30vh] md:h-auto w-full grid grid-cols-2 grid-rows-2 gap-5">
          <ImageWrapper photos={openingHourContent?.OpeninghourPhotos || []} />
        </div>
      </div>

      <div className="shadow-[15px_10px_4px_rgba(0,0,0,0.25)] rounded-[4rem] h-auto w-[100%] sm:w-[95%] mx-auto bg-black mt-[9%] flex flex-col md:flex-row">
        <div className="w-full h-auto md:w-[45%] md:h-auto flex flex-col justify-center gap-y-4 pt-[10%] md:p-[10%] text-center md:text-left">
          <h1 className="text-[1.8rem] sm:text-[2.2rem] xl:text-[3rem]">What our customer said</h1>
          <div className="w-full max-w-xs">
            <Image src={logo} alt="testimonial" width={250} height={250} className="hidden md:block" />
          </div>
        </div>

        <div className="w-full h-full md:w-[55%]">
          <TestimonialSlider testimonials={openingHourContent?.testimonials} />
        </div>
      </div>
    </div>
  );
}
