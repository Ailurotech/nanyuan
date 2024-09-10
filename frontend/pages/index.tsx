import HomePage from "../components/homepage/HomePage";
import { GetStaticProps } from "next";
import { sanityClient } from "@/lib/sanityClient";
import { HomePageContent as HomePageContentType } from "@/types";

interface IndexProps {
  homePageContent: HomePageContentType | null;
}

export default function Index({ homePageContent }: IndexProps) {
  return (
    <div>
      <HomePage homePageContent={homePageContent} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = `
    *[_type == "HomePageContent"][0]{
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
      chefname
    }
  `;

  const homePageContent = await sanityClient.fetch(query);

  return {
    props: {
      homePageContent,
    },
  };
};
