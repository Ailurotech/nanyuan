import { Alegreya_Sans_SC } from "next/font/google";
import { HomePageContent, NavigationRoute } from "@/components/homepage/route"; // 导入 NavigationRoute

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
  }
};

export default function Home() {
  return (
    <div className="w-full h-screen bg-cover bg-center pt-40" style={styles.container}>
      {/* 在这里使用 sm:mt-[15vh] 和 lg:mt-[25vh] */}
      <div className="mt-[5vh] sm:mt-[20vh] lg:mt-[25vh] w-[60%] mx-auto text-center flex flex-col items-center">
        <h1
          className={`${alegreyaSansSC.className} text-white text-center`}
          style={styles.heading}
        >
          {HomePageContent.title.text}
        </h1>
        <NavigationRoute.Menu.Link>
          <button
            className="mt-[4vh] sm:mt-[8vh] px-7 py-4 bg-[#F9BF28] text-black font-bold hover:bg-[#e0a622] flex items-center relative group after:content-[''] after:w-0 after:h-0 after:border-t-[5px] after:border-b-[5px] after:border-l-[8px] after:border-t-transparent after:border-b-transparent after:border-l-black after:ml-2 group-hover:after:border-l-gray-800"
          >
            {HomePageContent.title.buttonText}
          </button>
        </NavigationRoute.Menu.Link>
      </div>
    </div>
  );
}
