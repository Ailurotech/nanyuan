import Slider from "react-slick";
import Image from "next/image";

type Testimonial = {
  name: string;
  review: string;
  region: string;
  image: {
    asset: {
      url: string;
    };
  };
};

type TestimonialSliderProps = {
  testimonials: Testimonial[];
};

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
  };

  return (
    <Slider className="w-full h-full" {...settings}>
      {testimonials.map((testimonial, index) => (
        <div key={index} className="h-[85%] md:h-[60vh] xl:h-[40em] p-[5%] sm:p-[10%] flex flex-col relative">
          <h1 className="text-[2.5rem] font-bold text-yellow-400">0{index + 1}</h1>
          <p className="text-[1.2rem] mt-4 md:text-[1rem] xl:text-[1.3rem] 2xl:text-[1.5rem] mb-20">{testimonial.review}</p>
          <div className="flex flex-row absolute bottom-[5%]">
            <Image
              src={testimonial.image.asset.url}
              alt={testimonial.name}
              width={100}
              height={100}
              className="rounded-full w-[50px] h-[50px] xl:w-[70px] xl:h-[70px]"
            />
            <div className="ml-4 flex w-auto flex-col">
              <h3 className="text-[1.3rem] md:text-[1.1rem] xl:text-[1.6rem] font-bold">{testimonial.name}</h3>
              <p className="text-[1.2rem] md:text-[1rem] xl:text-[1.5rem]">{testimonial.region}</p>
            </div>
          </div>
          <div className="dots mt-2 absolute w-full bottom-[5%] right-12">
            <ul className="flex flex-row-reverse space-x-2 space-x-reverse">
              {testimonials.map((_, dotIndex) => (
                <li key={dotIndex}>
                  <button
                    className={`w-3 h-3 rounded-full ${index === dotIndex ? "bg-gray-500" : "bg-white"}`}
                  ></button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </Slider>
  );
}
