import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { Icon } from "../../common/Icon";
import { Acme } from "next/font/google";
import clsx from "clsx";
import { RoutRoute, SocialRoute } from "../route";
import { NavigationMenu } from "./NavigationMenu";
import { NavigationDrawer } from "./NavigationDrawer";

const acme = Acme({ weight: "400", subsets: ["latin"] });

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className={clsx("fixed top-0", acme.className)}>
        <nav className="bg-black w-screen flex items-center justify-evenly py-6">
          <Link href={RoutRoute.Rout.Path}>
            <Image src={logo} alt="logo" width="100" />
          </Link>
          <ul className="hidden md:flex md:gap-8 lg:gap-x-24 xl:gap-x-32 text-white text-lg lg:text-xl">
            <NavigationMenu />
          </ul>
          <NavigationDrawer font={acme} />
          <div className="flex text-white items-center text-xl lg:text-2xl">
            <div className="flex h-[60px] border-r-[1px] px-3 lg:px-5 gap-3 lg:gap-5 items-center">
              {Object.values(SocialRoute).map((route) => (
                <Link key={route.Name} href={route.Path} target="_blank">
                  <Icon name={route.Name as Icon} className="stroke-[2.3px]" />
                </Link>
              ))}
            </div>
            <div className="px-3 lg:px-5 font-bold text-xl lg:text-2xl">
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
