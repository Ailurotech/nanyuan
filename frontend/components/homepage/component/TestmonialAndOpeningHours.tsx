import { useState, useEffect } from "react";
import axios from "axios";
import OpeningHoursList from "./OpeningHoursList";
export default function TestmonialAndOpeningHours() {
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

  return (
    <div className={`h-[100vh] px-[8%] py-[5%] sm:px-[16%] bg-[#4E4E4E] text-white justify-center items-center`}>
      <div className="flex flex-col gap-x-[8%] md:flex-row">
        <div className="w-[100%]">
          <div>
            <h1 className="text-[3rem] sm:text-[2.5rem] xl:text-[3.7em] whitespace-nowrap">Opening Hours</h1>
          </div>
          <div className="mt-[6%]">
            <OpeningHoursList openingHours={openingHours} />
          </div>
        </div>
        <div className="w-[100%]" >
          dsadasdawdd
        </div>
      </div>
    </div>
  );
}
