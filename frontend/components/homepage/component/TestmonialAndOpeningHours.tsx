import { useState, useEffect } from "react";
import axios from "axios";
import OpeningHoursList from "./OpeningHoursList";
import { OpeningHoursContent } from "@/types";
import ImageWrapper from "./ImageWrapper";
import styles from "@/styles/homepage.module.css";
import Image from "next/image";
import logo from "@/public/logo.png";

type OpeningHourProps = {
  openingHourcontent: OpeningHoursContent;
};

export default function TestmonialAndOpeningHours({ openingHourcontent }: OpeningHourProps){
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
    console.log(openingHourcontent);
    fetchOpeningHours();
  }, []);


  return (
    <div className={`h-[150vh] px-[8%] py-[5%] sm:px-[16%] bg-[#1E1E1E] text-white justify-center items-center `}>
      <div className=" h-[auto] flex flex-col gap-x-[8%] gap-y-[20px] md:flex-row">
        <div className="w-[100%]">
          <div>
            <h1 className="text-[3rem] sm:text-[2.5rem] xl:text-[3.7em] whitespace-nowrap">Opening Hours</h1>
          </div>
          <div className="mt-[6%]">
            <OpeningHoursList openingHours={openingHours} />
          </div>
        </div>
        <div className="h-[30vh] md:h-[auto] w-[100%] grid grid-cols-2 grid-rows-2 gap-5">
          <ImageWrapper photos={openingHourcontent?.OpeninghourPhotos || []} />
        </div>
      </div>
      <div className={`${styles["shadow-custom-right"]} ${styles["rounded-lg"]} h-[45vh] w-[95%] mx-auto bg-black mt-[9%] flex flex-col md:flex-row md:h-[60vh]`}>
                  <div className="w-full h-auto md:w-[45%] md:h-[100%] flex flex-col items-center justify-center space-y-4">
              <div>
                <h1 className="text-[2rem] sm:text-[2.5rem] xl:text-[3rem] text-center">
                  What our customer said
                </h1>
              </div>
              <div className="w-full max-w-xs">
                <Image src={logo} alt="testmonial" width={300} height={300} className="" />
              </div>
            </div>

        <div className=" w-full h-[80%] md:w-[55%] md:h-[100%]">

        </div>
      </div>
    </div>
  );
}
