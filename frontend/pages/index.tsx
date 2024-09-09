import HomePage from "../components/homepage/HomePage";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient";
import { HomePageContent as HomePageContentType } from "@/types";
import { Content } from "@/components/homepage/component/Content";
import { GalleryWidget } from "@/components/homepage/component/GalleryWidget";

interface IndexProps {
  homePageContent: HomePageContentType[];
}

export default function Index({ homePageContent }: IndexProps) {
  const { galleryPhotos } = homePageContent[0];
  return (
    <>
      <HomePage homePageContent={homePageContent[0]} />
      <Content>
        <GalleryWidget galleryPhotos={galleryPhotos} />
      </Content>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = `
    *[_type == "HomePageContent"]{
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
      }
    }
  `;

  const homePageContent = await sanityClient.fetch(query);

  return {
    props: {
      homePageContent,
    },
    revalidate: 60,
  };
};
