import { GalleryContent } from '@/types';
import { IndividualPhoto } from './IndividualPhoto';
import { NavigationRoute } from '../route';
import { Icon } from '@/components/common/Icon';
import clsx from 'clsx';
import React, { useState } from 'react';

type GalleryWidgetProps = {
  galleryContent: GalleryContent;
};

export function GalleryWidget({ galleryContent }: GalleryWidgetProps) {
  const { galleryPhotos, menuName, menuDescription, menuLink } = galleryContent;
  const menuDescriptionText = menuDescription[0].children[0].text;
  return (
    <div className="grid w-[70%] aspect-[4/3] m-auto -translate-y-[20%] grid-cols-4 grid-rows-3 group">
      {galleryPhotos.map((photo, index) => {
        switch (index) {
          case 0:
            return <IndividualPhoto key={index} photo={photo} isColor />;
          case 6:
            return (
              <React.Fragment key={index}>
                <div
                  className={clsx(
                    'relative col-span-2 bg-white flex flex-col items-end justify-center lg:justify-end text-right overflow-hidden',
                    'p-2 sm:p-6 xl:pb-5 xl:px-12 2xl:pb-8 2xl:px-16',
                    'gap-1 md:gap-2 lg:gap-4 xl:gap-6 2xl:gap-8',
                  )}
                >
                  <h1
                    className={clsx(
                      'relative text-[1rem] sm:text-[1.3rem] lg:text-[2rem] xl:text-[2.5rem] 2xl:text-[3rem] font-serif',
                      "after:content-[''] after:block after:w-[30%] after:h-[1px] after:bg-[#F9BF28] after:absolute",
                      'after:right-0 after:top-full after:md:mt-1 after:2xl:mt-2',
                    )}
                  >
                    {menuName}
                  </h1>
                  <span className="text-[0.6rem] xl:text-[0.8rem] hidden lg:block">
                    {menuDescriptionText}
                  </span>
                  <NavigationRoute.Menu.Link className="mt-1 text-[0.5rem] xl:text-[0.8rem] flex gap-2 items-center font-bold">
                    {`view ${menuLink}'s menus`.toUpperCase()}
                    <Icon name="arrow" className="text-green-500" />
                  </NavigationRoute.Menu.Link>
                </div>
                <IndividualPhoto photo={photo} />
              </React.Fragment>
            );
          default:
            return <IndividualPhoto key={index} photo={photo} />;
        }
      })}
    </div>
  );
}
