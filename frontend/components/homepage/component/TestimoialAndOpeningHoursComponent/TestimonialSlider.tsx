import { useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Testimonial } from "@/types";

type TestimonialSliderProps = {
  testimonials: Testimonial[];
};

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {

  const [currentIndex, setCurrentIndex] = useState(0);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentIndex(newIndex); 
    },
  };

  return (
    <div className="relative">
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="xl:h-[40rem] p-[8%] sm:p-[10%] flex flex-col ">
            <h1 className="text-[2.5rem] font-bold text-yellow-400">0{index + 1}</h1>
            <p className="text-[1.5rem] mt-3 sm:text-[1.2rem] xl:text-[1.3rem] 2xl:text-[1.5rem] mb-20 ">
              {testimonial.review}
            </p>
            <div className="flex flex-row absolute bottom-[5%]">
              <Image
                src={testimonial.image.asset.url}
                alt={testimonial.name}
                width={100}
                height={100}
                className="rounded-full w-[50px] h-[50px] xl:w-[70px] xl:h-[70px]"
              />
              <div className="ml-4 flex flex-grow w-full flex-col">
                <h3 className="text-[1.3rem] md:text-[1.1rem] xl:text-[1.6rem] font-bold">{testimonial.name}</h3>
                <p className="text-[1.2rem] md:text-[1rem] xl:text-[1.5rem]">{testimonial.region}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div className="dots w-full absolute right-16 bottom-10">
        <ul className="flex flex-row-reverse gap-x-2 gap-x-reverse">
          {testimonials.map((_, dotIndex) => (
            <li key={dotIndex}>
              <button
                className={`w-3 h-3 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-full ${
                  currentIndex === dotIndex ? "bg-gray-500" : "bg-white"
                }`}
              ></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
