import Image from "next/image";
import logo from "@/public/loge.jpeg";
import { NavigationRoute } from "./route";
import Link from "next/link";
import { Icon } from "../common/Icon";
import { Acme } from "next/font/google";
import clsx from "clsx";

const acme = Acme({ weight: "400", subsets: ["latin"] });

export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const array = Object.values(NavigationRoute);

  return (
    <div>
      <header>
        <nav className="fixed top-0 left-0 bg-black w-screen flex items-center justify-evenly py-6">
          <div>
            <Image src={logo} alt="logo" width="100" className="" />
          </div>

          <ul
            className={clsx("flex gap-12 text-white text-base", acme.className)}
          >
            {array.map((route) => (
              <li key={route.Name}>
                <Link href={route.Path} className="">
                  {route.Name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex h-full text-white items-center">
            <div className="flex border-r-[1px] px-3 gap-3">
              <Icon name="facebook" className="text-xl font-bold" />
              <Icon name="instagram" className=" text-xl font-bold" />
            </div>
            <div className="px-3">
              <Icon name="mobile" className=" text-xl font-bold " />
            </div>
            <h3 className="text-sm">(08)8271 3133</h3>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
}
