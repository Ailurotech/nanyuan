import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { Icon } from "../../common/Icon";
import { Acme } from "next/font/google";
import clsx from "clsx";
import { NavigationRoute, RoutRoute, SocialRoute } from "../route";

const acme = Acme({ weight: "400", subsets: ["latin"] });

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className={clsx("fixed top-0 left-0 w-full z-50 bg-black bg-opacity-70", acme.className)}>
        <nav className="w-screen flex items-center justify-evenly py-6">
          <Link href={RoutRoute.Rout.Path}>
            <Image src={logo} alt="logo" width="100" />
          </Link>
          <ul className="flex gap-12 xl:gap-28 text-white text-lg xl:text-xl">
            {Object.values(NavigationRoute).map((route) => (
              <li key={route.Name}>
                <Link href={route.Path}>{route.Name}</Link>
              </li>
            ))}
          </ul>
          <div className="flex text-white items-center text-xl xl:text-2xl">
            <div className="flex h-[60px] border-r-[1px] px-3 xl:px-5 gap-3 xl:gap-5 items-center ">
              {Object.values(SocialRoute).map((route) => (
                <Link key={route.Name} href={route.Path} target="_blank">
                  <Icon name={route.Name as Icon} className="stroke-[2.3px]" />
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
      {children}
    </>
  );
}