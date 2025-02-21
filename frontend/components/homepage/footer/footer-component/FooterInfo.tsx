import React from 'react';
import { Icon } from '@/components/common/Icon';
import { SocialRoute } from '@/components/homepage/route';
import Link from 'next/link';
import { FooterContent } from '@/types';
import { Abhaya_Libre } from 'next/font/google';
import { NavigationRoute } from '@/components/homepage/route';

interface FooterInfoProps {
  footerContent: FooterContent;
}

const abhayaLibre = Abhaya_Libre({ weight: '400', subsets: ['latin'] });

export default function FooterInfo({ footerContent }: FooterInfoProps) {
  return (
    <>
      <div
        className={`xl:w-[70%] lg:w-[1024px] md:w-[768px] w-[90vw] h-auto flex flex-wrap md:flex-nowrap mx-auto text-yellow-500 relative gap-5 ${abhayaLibre.className}`}
      >
        <iframe
          src={footerContent.mapEmbedUrl.trim()}
          width="auto"
          height="auto"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="flex-1 min-w-[12rem] min-h-[12rem] md:w-[auto] md:max-w-[25rem] w-full"
        ></iframe>
        <div className="flex flex-1 flex-row gap-5 w-full md:w-auto">
          <div className="flex-1 flex flex-col items-start text-left md:pr-10">
            <h1 className="text-3xl font-bold leading-none mb-5">Address</h1>
            <p className="text-xl text-white">{footerContent.address}</p>
          </div>
          <div className="flex-1 flex flex-col items-start text-left">
            <h1 className="text-3xl font-bold leading-none mb-5">Details</h1>
            {Object.values(NavigationRoute).map((route) => (
              <li
                key={route.Name}
                className="text-xl text-white leading-loose list-none no-wrap hover:text-yellow-500 transition-all duration-300"
              >
                <Link href={route.Path}>{route.Name}</Link>
              </li>
            ))}
          </div>
          <div className="flex-1 whitespace-normal overflow-hidden">
            <h1 className="text-3xl font-bold leading-none mb-5">Contact</h1>
            <p className="text-xl text-white">{footerContent.phone}</p>
            <p className="text-xl text-white break-words">
              {footerContent.email}
            </p>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-300 opacity-50 my-4 lg:w-[1024px] md:w-[768px] xl:w-[70%] mx-auto mt-[5vh]" />
      <div className="flex flex-col-reverse gap-5 md:flex-row md:justify-between items-center lg:w-[1024px] md:w-[768px] w-[320px] xl:w-[70%] h-auto pb-10 mx-auto mt-2">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm text-white">
            {footerContent.copyright.split('!')[0]}
            <span className="text-yellow-500">
              {footerContent.copyright.split('!')[1]}
            </span>
          </p>
        </div>
        <div className="flex flex-row gap-3 space-x-10">
          {Object.values(SocialRoute).map((route) => (
            <Link key={route.Name} href={route.Path} target="_blank">
              <Icon
                name={route.Name as Icon}
                className="stroke-[2px] text-yellow-500 w-6 h-6 hover:scale-110 transition-all duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
