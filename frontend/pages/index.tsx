import Link from "next/link";
import Image from "next/image"; 
import styles from "../styles/homepage.module.css";  
import { GetStaticProps } from "next";
import { sanityClient } from "../lib/sanityClient";
import { HomePageContent as HomePageContentType } from "../types"; 
import { NavigationRoute } from "@/components/homepage/route"; 

interface HomePageProps {
  homePageContent: HomePageContentType;
}

const Home = ({ homePageContent }: HomePageProps) => {
  return (
    <div className={`w-full bg-cover bg-center pt-40 ${styles['font-alegreya-sans']}`} style={{ backgroundImage: `url(${homePageContent.backgroundimg.asset.url})`}}>
      <div className="h-[80vh] mt-[1vh] sm:mt-[20vh] lg:mt-[25vh] w-[60%] mx-auto text-center flex flex-col items-center">
        <h1 className="text-white text-center text-[50px] font-normal leading-[43.2px]">
          {homePageContent.Homepagetitle}
        </h1>
        <Link href={NavigationRoute.Menu.Path}> 
          <button
            className="mt-[4vh] sm:mt-[8vh] px-7 py-4 bg-[#F9BF28] text-black font-bold hover:bg-[#e0a622] flex items-center"
          >
            SEE OUR MENU
          </button>
        </Link>
      </div>
      <div className="w-[73%] h-screen flex flex-col md:flex-row mx-auto">
        <div className="w-auto h-auto object-cover">
          <Image
            src={homePageContent.dishimg?.asset?.url} 
            alt="Dish"
            width={500}
            height={500}
            className={`rounded-full ${styles.maskedImage}`} 
          />
        </div>
        <div className="w-auto ml-[5%]">
          <h1 className="text-white mt-[15%] text-[37px] font-normal leading-[38px]">
            {homePageContent.cheftext}
          </h1>
          <h1 className="text-green-500 mt-[9%] text-[37px] font-normal leading-[38px]">
            {homePageContent.chefname}
          </h1>
        </div>
      </div>
    </div>
  );
};


export const getStaticProps: GetStaticProps = async () => {
  const query = `
    *[_type == "HomePageContent"][0]{
      Homepagetitle,
      backgroundimg{
        asset->{
          url
        }
      },
      dishimg{
        asset->{
          url
        }
      },
      cheftext,
      chefname
    }
  `;

  const homePageContent = await sanityClient.fetch(query); 

  return {
    props: {
      homePageContent, 
    },
   
  };
};

export default Home;
