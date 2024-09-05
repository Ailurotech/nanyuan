import Image from "next/image";
import logo from "@/public/loge.jpeg";
import { NavigationRoute, SocialRoute } from "./route";
import Link from "next/link";
import { Icon } from "../common/Icon";
import { Acme } from "next/font/google";
import clsx from "clsx";

const acme = Acme({ weight: "400", subsets: ["latin"] });

export default function Navigation() {
  return (
    <>
      <header className={(clsx("fixed top-0"), acme.className)}>
        <nav className="bg-black w-screen flex items-center justify-evenly py-6">
          <Image src={logo} alt="logo" width="100" />
          <ul className="flex gap-12 xl:gap-28 text-white text-lg xl:text-xl">
            {Object.values(NavigationRoute).map((route) => (
              <li key={route.Name}>
                {<Link href={route.Path}>{route.Name}</Link>}
              </li>
            ))}
          </ul>
          <div className="flex text-white items-center text-xl xl:text-2xl ">
            <div className="flex h-[60px] border-r-[1px] px-3 xl:px-5 gap-3 xl:gap-5 items-center ">
              {Object.values(SocialRoute).map((route) => (
                <Link key={route.Name} href={route.Path} target="_blank">
                  <Icon name={route.Name as Icon} className=" stroke-[2.3px]" />
                </Link>
              ))}
            </div>
            <div className="px-3 xl:px-5 font-bold text-xl xl:text-2xl">
              <Icon name="mobile" />
            </div>
            <h3 className="text-lg">(08)8271 3133</h3>
          </div>
        </nav>
      </header>
    </>
  );
}
