import HomePage from "../components/homepage/HomePage";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient";
import { GalleryContent, HeroContent } from "@/types";
import { Content } from "@/components/homepage/component/Content";
import { GalleryWidget } from "@/components/homepage/component/GalleryWidget";

interface IndexProps {
  heroContent: HeroContent[];
  galleryContent: GalleryContent[];
}

export default function Index({ heroContent, galleryContent }: IndexProps) {
  return (
    <>
      <HomePage homePageContent={heroContent[0]} />
      <Content>
        <GalleryWidget galleryContent={galleryContent[0]} />
      </Content>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const heroQuery = `
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
    }
  `;
  const galleryWidgetQuery = `
  *[_type == "HomePage"]{
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

  const homePageContent = await Promise.all([
    sanityClient.fetch(heroQuery),
    sanityClient.fetch(galleryWidgetQuery),
  ]);
  const [heroContent, galleryContent] = homePageContent;

  return {
    props: {
      heroContent,
      galleryContent,
    },
    revalidate: 60,
  };
};
