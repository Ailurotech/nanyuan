import HomePage from "../components/homepage/HomePage";
import TestmonialAndOpeningHours from "../components/homepage/component/TestmonialAndOpeningHours";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient";
import { GalleryContent, HeroContent, OpeningHoursContent } from "@/types";
import { Content } from "@/components/homepage/component/Content";
import { GalleryWidget } from "@/components/homepage/component/GalleryWidget";
import OpeningHoursList from "@/components/homepage/component/OpeningHoursList";

interface IndexProps {
  heroContent: HeroContent;
  galleryContent: GalleryContent;
  openingHourcontent: OpeningHoursContent;
}

export default function Index({ heroContent, galleryContent,openingHourcontent }: IndexProps) {
  return (
    <>
      <HomePage homePageContent={heroContent} />
      <Content>
        <GalleryWidget galleryContent={galleryContent} />
      </Content>
      <TestmonialAndOpeningHours openingHourcontent={openingHourcontent} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = `
    *[_type == "HomePage"]{
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
      chefname,
      galleryPhotos[] {
        asset -> {
          url
        }
      },
      menuName,
      menuLink,
      menuDescription[] {
        children[] {
          text
        }
      },
      OpeninghourPhotos[] {
        asset -> {
          url
        }
      },
      testimonials[] {
        name,
        review,
        image {
          asset -> {
            url
          }
        }
      }
    }
  `;

  try {
    const data = await sanityClient.fetch(query);
    
    // Assuming data[0] is the HomePage content
    return {
      props: {
        heroContent: {
          Homepagetitle: data[0].Homepagetitle,
          backgroundimg: data[0].backgroundimg,
          dishimg: data[0].dishimg,
          cheftext: data[0].cheftext,
          chefname: data[0].chefname,
        },
        galleryContent: {
          galleryPhotos: data[0].galleryPhotos,
          menuName: data[0].menuName,
          menuLink: data[0].menuLink,
          menuDescription: data[0].menuDescription,
        },
        openingHourcontent: {
          OpeninghourPhotos: data[0].OpeninghourPhotos,
          testimonials: data[0].testimonials,
        },
      },
    };
  } catch (e) {
    console.error("Error fetching data:", e);
    return {
      props: {
        heroContent: null,
        galleryContent: null,
        openingHourcontent: null,
      },
    };
  }
};
