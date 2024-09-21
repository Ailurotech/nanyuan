import { useState, useEffect } from "react";
import axios from "axios";
import OpeningHoursList from "./OpeningHoursList";
import { OpeningHoursContent } from "@/types";
import ImageWrapper from "./ImageWrapper";
import styles from "@/styles/homepage.module.css";
import Image from "next/image";
import Slider from "react-slick";
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

  // 获取 testimonials 数据
  const testimonials = openingHourcontent?.testimonials || [];

  // Slick carousel settings
  const settings = {
    dots: false, // 禁用默认 dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1, 
    autoplay: false,
    autoplaySpeed: 4000,
  };

  return (
    <div className={`h-[150vh] px-[8%] py-[5%] sm:px-[16%] bg-[#1E1E1E] text-white justify-center items-center`}>
      <div className="h-[auto] flex flex-col gap-x-[8%] gap-y-[20px] md:flex-row">
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
      <div className={`${styles["shadow-custom-right"]} ${styles["font-abhaya-libre"]} ${styles["rounded-lg"]} h-[auto] w-[100%] sm:w-[95%] mx-auto bg-black mt-[9%] flex flex-col md:flex-row md:h-[auto]`}>
        <div className="w-full h-auto md:w-[45%] md:h-[100%] flex flex-col justify-center space-y-4 p-[6%] py-[3%] sm:p-[10%] text-center md:text-left">
          <div>
            <h1 className="text-[2rem] sm:text-[2.2rem] xl:text-[3rem]">What our customer said</h1>
          </div>
          <div className="w-full max-w-xs">
            <Image src={logo} alt="testmonial" width={250} height={250} className="hidden md:block" />
          </div>
        </div>
        <div className="w-full h-full md:w-[55%]">
          <Slider className="w-full h-full " {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className=" p-[5%] sm:p-[10%] h flex flex-col relative">
                <h1 className="text-[2.5rem] font-bold text-yellow-400">0{index + 1}</h1>
                <p className="text-[1.2rem] mt-4 md:text-[1rem] xl:text-[1.5rem] mb-20">{testimonial.review}</p>
                <div className="absolute bottom-[5%] flex flex-row w-full">
                  <Image
                    src={testimonial.image.asset.url}
                    alt={testimonial.name}
                    width={100}
                    height={100}
                    className="rounded-full w-[50px] h-[50px] xl:w-[70px] xl:h-[70px]"
                  />
                  <div className="ml-4 flex w-auto flex-col ">
                    <h3 className="text-[1.3rem] md:text-[1.1rem] xl:text-[1.6rem] font-bold">{testimonial.name}</h3>
                    <p className="text-[1.2rem] md:text-[1rem] xl:text-[1.5rem]">Adelaide</p>
                  </div>
                  <div className="dots mt-2 absolute  left-[10%]">
                    <ul className="flex space-x-2">
                      {testimonials.map((_, dotIndex) => (
                        <li key={dotIndex}>
                          <button
                            className={`w-3 h-3 rounded-full ${
                              index === dotIndex ? "bg-gray-500" : "bg-white"
                             }`}
                           ></button>
                        </li>
                       ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
