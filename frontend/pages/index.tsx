import { Alegreya_Sans_SC } from "next/font/google";
import { HomePageContent} from "@/components/homepage/route";
import Link from "next/link";

const alegreyaSansSC = Alegreya_Sans_SC({
  subsets: ["latin"],
  weight: ['400'],
});

const styles = {
  container: {
    backgroundImage: `url(${HomePageContent.background.path})`,
  },
  heading: {
    fontSize: '50px',
    fontWeight: '400',
    lineHeight: '43.2px',
  },
  dishImage: {
    borderRadius: '50%',
    maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)',
    WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
  }, 
  chef: {
    fontSize: '37px',
    fontWeight: '400',
    lineHeight: '38px',
  }, 
  
};

export default function Home() {
  return (
    <div className={`${alegreyaSansSC.className} w-full bg-cover bg-center pt-40`} style={styles.container}>
      <div className="h-[80vh] mt-[1vh] sm:mt-[20vh] lg:mt-[25vh] w-[60%] mx-auto text-center flex flex-col items-center">
        <h1
          className={`text-white text-center`}
          style={styles.heading}
        >
          {HomePageContent.title.text}
        </h1>
        <Link href={HomePageContent.title.path}>
          <button
            className="mt-[4vh] sm:mt-[8vh] px-7 py-4 bg-[#F9BF28] text-black font-bold hover:bg-[#e0a622] flex items-center relative group after:content-[''] after:w-0 after:h-0 after:border-t-[5px] after:border-b-[5px] after:border-l-[8px] after:border-t-transparent after:border-b-transparent after:border-l-black after:ml-2 group-hover:after:border-l-gray-800"
          >
            {HomePageContent.title.buttonText}
          </button>
        </Link>
      </div>
      <div className="w-[73%] h-screen flex flex-col md:flex-row mx-auto">
        <div className="w-[auto] h-[auto] object-cover ">
          <img
            src={HomePageContent.dish.path}
            alt="Background"
            className="w-[auto] h-[auto] object-cover"
            style={styles.dishImage}
          />
        </div>
        <div className="w-[auto] ml-[5%]">
          <h1 className={`text-white mt-[15%] `}
          style={styles.chef}>{HomePageContent.chef.text} </h1>
          <h1 className={`text-green-500 mt-[9%] `}
          style={styles.chef}>{HomePageContent.chef.name}</h1>
        </div>
      </div>
    </div>
  );
}
