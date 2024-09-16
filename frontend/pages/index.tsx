import HomePage from "../components/homepage/HomePage";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient";
import { GalleryContent, HeroContent } from "@/types";
import { Content } from "@/components/homepage/component/Content";
import { GalleryWidget } from "@/components/homepage/component/GalleryWidget";
import InstagramSection from "@/components/homepage/component/InstagramSection";

interface IndexProps {
  heroContent: HeroContent;
  galleryContent: GalleryContent;
  instagramContent: {
    instagramUrls: { url: string; href?: string }[];
    heading: string;
    subheading: string;
  };
}

export default function Index({
  heroContent,
  galleryContent,
  instagramContent,
}: IndexProps) {
  return (
    <>
      <HomePage homePageContent={heroContent} />
      <Content>
        <GalleryWidget galleryContent={galleryContent} />
      </Content>
      <InstagramSection
        instagramUrls={instagramContent.instagramUrls}
        heading={instagramContent.heading}
        subheading={instagramContent.subheading}
      />
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
  const instagramQuery = `
  *[_type == "instagramContent"]{
    instagramUrls[]{
      url,
      href
    },
    heading,
    subheading
  }
`;
  try {
    const data = await sanityClient.fetch(query);
    const instagramData = await sanityClient.fetch(instagramQuery);

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
        instagramContent: instagramData[0],
      },
    };
  } catch (e) {
    console.error("Error fetching data:", e);
    return {
      props: {
        heroContent: null,
        galleryContent: null,
        instagramContent: {
          instagramUrls: [],
          heading: "No content available",
          subheading: "",
        },
      },
    };
  }
};
