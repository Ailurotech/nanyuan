import { useState, useEffect } from "react";
import axios from "axios";
import OpeningHoursList from "./OpeningHoursList";
import { OpeningHoursContent } from "@/types";
import image from "next/image";

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
    <div className={`h-[100vh] px-[8%] py-[5%] sm:px-[16%] bg-[#1E1E1E] text-white justify-center items-center `}>
      <div className=" h-[auto] flex flex-col gap-x-[8%] md:flex-row">
        <div className="w-[100%]">
          <div>
            <h1 className="text-[3rem] sm:text-[2.5rem] xl:text-[3.7em] whitespace-nowrap">Opening Hours</h1>
          </div>
          <div className="mt-[6%]">
            <OpeningHoursList openingHours={openingHours} />
          </div>
        </div>
        <div className="h-[auto] w-[100%] grid grid-cols-2 grid-rows-2 gap-5" >
          <div >
            <img
              src={openingHourcontent?.OpeninghourPhotos?.[0]?.asset?.url}
              alt="Opening Hours"
              className="w-[100%] h-[100%] object-cover"
            />
          </div>
          <div className=" row-span-2">
            111
          </div>
          <div >  
            112
          </div>
        </div>
      </div>
    </div>
  );
}
