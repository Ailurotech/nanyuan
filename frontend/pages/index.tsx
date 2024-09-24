import HomePage from "../components/homepage/HomePage";
import TestmonialAndOpeningHours from "../components/homepage/component/TestmonialAndOpeningHours";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient";
import { GalleryContent, HeroContent, OpeningHoursContent } from "@/types";
import { Content } from "@/components/homepage/component/Content";
import { GalleryWidget } from "@/components/homepage/component/GalleryWidget";
import axios from "axios";

interface IndexProps {
  heroContent: HeroContent;
  galleryContent: GalleryContent;
  openingHourContent: OpeningHoursContent;
}

export default function Index({ heroContent, galleryContent, openingHourContent }: IndexProps) {
  return (
    <>
      <HomePage homePageContent={heroContent} />
      <Content>
        <GalleryWidget galleryContent={galleryContent} />
      </Content>
      <TestmonialAndOpeningHours openingHourContent={openingHourContent} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const sanityQuery = `
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
        region,
        image {
          asset -> {
            url
          }
        }
      }
    }
  `;
  const apiKey = "apiKey"; 
  const placeId = "ChIJeeMv3fjPsGoRqQoVj86mqvM"; 
  const mapsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${apiKey}`;

  try {
    const data = await sanityClient.fetch(sanityQuery);
    
    const googleResponse = await axios.get(mapsUrl);
    const openingHours = googleResponse.data.result?.opening_hours?.weekday_text || [''];


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
      },
    };
  } catch (e) {
    console.error('Error fetching data:', e);
    return {
      props: {
        heroContent: null,
        galleryContent: null,
        openingHourContent: null,
      },
    };
  }
};
