import Link from "next/link";
import Image from "next/image"; 
import styles from "@/styles/homepage.module.css";  
import { HomePageContent as HomePageContentType } from "@/types"; 
import { NavigationRoute } from "@/components/homepage/route"; 
import Arrow from '@/components/common/arrow';

interface HomePageProps {
  homePageContent: HomePageContentType | null;
}

const HomePage = ({ homePageContent }: HomePageProps) => {
  if (!homePageContent) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-red-500 text-3xl">Failed to load Homepage content. Please try again later.</h1>
      </div>
    );
  }
  return (
    <div 
      className={`w-full bg-cover bg-center pt-40 ${styles['font-alegreya-sans']}`} 
      style={{ backgroundImage: `url(${homePageContent.backgroundimg.asset.url})` }}
    >
      <div className="h-[60vh] mt-[7vh] mb-[13vh] sm:mt-[20vh] sm:mb-[0vh] lg:mt-[25vh] w-[60%] mx-auto text-center flex flex-col items-center">
        <h1 className="text-white text-center text-[50px] font-normal leading-[43.2px]">
          {homePageContent.Homepagetitle}
        </h1>
        <Link href={NavigationRoute.Menu.Path}> 
          <button className="mt-[4vh] sm:mt-[8vh] px-7 py-4 bg-[#F9BF28] text-black font-bold hover:bg-[#e0a622] flex items-center space-x-2 whitespace-nowrap">
            <span className="text-xl">SEE OUR MENU</span>
            <Arrow />
          </button>
        </Link>
      </div>
      <div className="w-[73%] pb-[10%] flex flex-col md:flex-row items-center mx-auto">
        <div className="min-w-[350px] w-full md:w-[40%]  xl:w-[35%] h-auto object-cover flex-shrink-0">
          <Image
            src={homePageContent.dishimg?.asset?.url} 
            alt="Dish"
            width={500}
            height={500}
            className={`rounded-full ${styles.maskedImage} w-full h-full`} 
          />
        </div>
        <div className=" md:w-auto ml-[0%] md:ml-[2%] flex flex-col justify-center text-center md:text-left ">
          <h1 className="text-white mt-[5vh] text-[37px] font-normal leading-[38px]">
            {homePageContent.cheftext}
          </h1>
          <h1 className="text-green-500 mt-[5vh] text-[37px] font-normal leading-[38px]">
            {homePageContent.chefname}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
