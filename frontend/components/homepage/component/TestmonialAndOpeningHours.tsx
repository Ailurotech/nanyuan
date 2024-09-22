import { useState, useEffect } from "react";
import axios from "axios";
import OpeningHoursList from "./TestimoialAndOpeningHoursComponent/OpeningHoursList";
import { OpeningHoursContent } from "@/types";
import ImageWrapper from "./TestimoialAndOpeningHoursComponent/ImageWrapper";
import styles from "@/styles/homepage.module.css";
import Image from "next/image";
import TestimonialSlider from "./TestimoialAndOpeningHoursComponent/TestimonialSlider";
import logo from "@/public/logo.png";

type OpeningHourProps = {
  openingHourcontent: OpeningHoursContent;
};

export default function TestmonialAndOpeningHours({ openingHourcontent }: OpeningHourProps) {
  const [openingHours, setOpeningHours] = useState<string[]>([]);

  useEffect(() => {
    const fetchOpeningHours = async () => {
      try {
        const response = await axios.get("/api/opening-hours");
        setOpeningHours(response.data.openingHours || []);
      } catch (err) {
        console.error("Error fetching opening hours:", err);
      }
    };
    fetchOpeningHours();
  }, []);

  const testimonials = openingHourcontent?.testimonials || [];

  return (
    <div className="h-auto px-[8%] py-[5%] sm:px-[16%] bg-[#1E1E1E] text-white justify-center items-center">
      <div className="h-auto min-h-[30vh] flex flex-col gap-x-[8%] gap-y-[20px] md:flex-row">
        <div className="w-[100%]">
          <h1 className="text-[3rem] sm:text-[2.5rem] xl:text-[3.7em] whitespace-nowrap">Opening Hours</h1>
          <div className="mt-[6%]">
            <OpeningHoursList openingHours={openingHours} />
          </div>
        </div>
        <div className="h-[30vh] md:h-auto w-[100%] grid grid-cols-2 grid-rows-2 gap-5">
          <ImageWrapper photos={openingHourcontent?.OpeninghourPhotos || []} />
        </div>
      </div>

      <div className={`${styles["shadow-custom-right"]} ${styles["font-abhaya-libre"]} ${styles["rounded-lg"]} h-auto w-[100%] sm:w-[95%] mx-auto bg-black mt-[9%] flex flex-col md:flex-row`}>
        <div className="w-full h-auto md:w-[45%] md:h-auto flex flex-col justify-center space-y-4 pt-[10%] md:p-[10%] text-center md:text-left">
          <h1 className="text-[1.8rem] sm:text-[2.2rem] xl:text-[3rem]">What our customer said</h1>
          <div className="w-full max-w-xs">
            <Image src={logo} alt="testimonial" width={250} height={250} className="hidden md:block" />
          </div>
        </div>

        <div className="w-full h-full md:w-[55%]">
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </div>
    </div>
  );
}
