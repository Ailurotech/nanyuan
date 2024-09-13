import HomePage from "../components/homepage/HomePage";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient";
import { GalleryContent, HeroContent } from "@/types";
import { Content } from "@/components/homepage/component/Content";
import { GalleryWidget } from "@/components/homepage/component/GalleryWidget";

interface IndexProps {
  heroContent: HeroContent;
  galleryContent: GalleryContent;
}

export default function Index({ heroContent, galleryContent }: IndexProps) {
  return (
    <>
      <HomePage homePageContent={heroContent} />
      <Content>
        <GalleryWidget galleryContent={galleryContent} />
      </Content>
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
      galleryPhotos[]{
        asset -> {
        url
        }
      },
      menuName,
      menuLink,
      menuDescription[]{
        children[]{
          text
        }
      }
    }
  `;

  try {
    const data = await sanityClient.fetch(query);
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
      },
    };
  } catch (e) {
    console.error("Error fetching data:", e);
    return {
      props: {
        heroContent: null,
        galleryContent: null,
      },
    };
  }
};
