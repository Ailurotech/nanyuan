import HomePage from "../components/homepage/HomePage";
import TestmonialAndOpeningHours from "../components/homepage/component/TestmonialAndOpeningHours";
import { GetStaticProps } from "next";
import { GalleryContent, HeroContent, OpeningHoursContent, FooterContent } from "@/types";
import { Content } from "@/components/homepage/component/Content";
import { GalleryWidget } from "@/components/homepage/component/GalleryWidget";
import Footer from "@/components/homepage/footer/Footer";
import { fetchHomePageData, fetchOpeningHours } from "@/lib/queries";

interface IndexProps {
  heroContent: HeroContent;
  galleryContent: GalleryContent;
  openingHourContent: OpeningHoursContent;
  footerContent: FooterContent;
}

export default function Index({ heroContent, galleryContent, openingHourContent, footerContent }: IndexProps) {
  return (
    <>
      <HomePage homePageContent={heroContent} />
      <Content>
        <GalleryWidget galleryContent={galleryContent} />
      </Content>
      <TestmonialAndOpeningHours openingHourContent={openingHourContent} />
      <Footer footerContent={footerContent} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const placeId = "ChIJeeMv3fjPsGoRqQoVj86mqvM";

  try {
    const data = await fetchHomePageData();
    const openingHours = await fetchOpeningHours(apiKey!, placeId);

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
        openingHourContent: {
          OpeninghourPhotos: data[0].OpeninghourPhotos,
          testimonials: data[0].testimonials,
          openingHours,
        },
        footerContent: data[0].footer,
      },
    };
  } catch (e) {
    console.error("Error fetching data:", e);
    return {
      props: {
        heroContent: null,
        galleryContent: null,
        openingHourContent: null,
        footerContent: null,
      },
    };
  }
};
